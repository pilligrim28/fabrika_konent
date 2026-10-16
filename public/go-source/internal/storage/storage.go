package storage

import (
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"content-factory/internal/config"
	"content-factory/internal/models"
)

type Storage struct {
	db *sql.DB
}

func New(cfg config.DatabaseConfig) (*Storage, error) {
	db, err := sql.Open(cfg.Driver, cfg.DSN)
	if err != nil {
		return nil, err
	}

	s := &Storage{db: db}
	if err := s.migrate(); err != nil {
		return nil, err
	}

	return s, nil
}

func (s *Storage) Close() error {
	return s.db.Close()
}

func (s *Storage) migrate() error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS content_plan (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			topic TEXT NOT NULL,
			content_type TEXT NOT NULL DEFAULT 'article',
			scheduled_at DATETIME NOT NULL,
			status TEXT NOT NULL DEFAULT 'planned',
			keywords TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS articles (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			plan_id INTEGER,
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			image_path TEXT,
			image_prompt TEXT,
			dzen_url TEXT,
			dzen_id TEXT,
			status TEXT NOT NULL DEFAULT 'draft',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			published_at DATETIME,
			FOREIGN KEY (plan_id) REFERENCES content_plan(id)
		)`,
		`CREATE TABLE IF NOT EXISTS logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			action TEXT NOT NULL,
			detail TEXT,
			status TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
	}

	for _, q := range queries {
		if _, err := s.db.Exec(q); err != nil {
			return err
		}
	}
	return nil
}

// GetContentPlan возвращает контент-план на указанную дату
func (s *Storage) GetContentPlan(date time.Time) ([]models.ContentPlanItem, error) {
	query := `SELECT id, title, topic, content_type, scheduled_at, status, keywords 
		FROM content_plan 
		WHERE DATE(scheduled_at) = DATE(?)
		ORDER BY scheduled_at`

	rows, err := s.db.Query(query, date.Format("2006-01-02"))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.ContentPlanItem
	for rows.Next() {
		var item models.ContentPlanItem
		err := rows.Scan(&item.ID, &item.Title, &item.Topic, &item.ContentType,
			&item.ScheduledAt, &item.Status, &item.Keywords)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, nil
}

// GetWeeklyPlan возвращает план на неделю
func (s *Storage) GetWeeklyPlan(startDate time.Time) ([]models.ContentPlanItem, error) {
	endDate := startDate.AddDate(0, 0, 7)
	query := `SELECT id, title, topic, content_type, scheduled_at, status, keywords 
		FROM content_plan 
		WHERE scheduled_at BETWEEN ? AND ?
		ORDER BY scheduled_at`

	rows, err := s.db.Query(query, startDate, endDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.ContentPlanItem
	for rows.Next() {
		var item models.ContentPlanItem
		err := rows.Scan(&item.ID, &item.Title, &item.Topic, &item.ContentType,
			&item.ScheduledAt, &item.Status, &item.Keywords)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, nil
}

// AddContentPlan добавляет элемент в контент-план
func (s *Storage) AddContentPlan(item models.ContentPlanItem) (int64, error) {
	query := `INSERT INTO content_plan (title, topic, content_type, scheduled_at, status, keywords)
		VALUES (?, ?, ?, ?, ?, ?)`
	result, err := s.db.Exec(query, item.Title, item.Topic, item.ContentType,
		item.ScheduledAt, item.Status, item.Keywords)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

// UpdatePlanStatus обновляет статус элемента плана
func (s *Storage) UpdatePlanStatus(id int64, status string) error {
	query := "UPDATE content_plan SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
	_, err := s.db.Exec(query, status, id)
	return err
}

// SaveArticle сохраняет статью
func (s *Storage) SaveArticle(article models.Article) (int64, error) {
	query := `INSERT INTO articles (plan_id, title, content, image_path, image_prompt, status)
		VALUES (?, ?, ?, ?, ?, ?)`
	result, err := s.db.Exec(query, article.PlanID, article.Title, article.Content,
		article.ImagePath, article.ImagePrompt, article.Status)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

// UpdateArticleDzenURL обновляет URL статьи на Дзене
func (s *Storage) UpdateArticleDzenURL(id int64, url string) error {
	query := "UPDATE articles SET dzen_url = ?, status = 'published', published_at = CURRENT_TIMESTAMP WHERE id = ?"
	_, err := s.db.Exec(query, url, id)
	return err
}

// AddLog добавляет запись в лог
func (s *Storage) AddLog(action, detail, status string) error {
	query := "INSERT INTO logs (action, detail, status) VALUES (?, ?, ?)"
	_, err := s.db.Exec(query, action, detail, status)
	return err
}

// GetStats возвращает статистику
func (s *Storage) GetStats() (map[string]int, error) {
	stats := make(map[string]int)

	rows, err := s.db.Query("SELECT status, COUNT(*) FROM articles GROUP BY status")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var status string
		var count int
		rows.Scan(&status, &count)
		stats["articles_"+status] = count
	}

	rows2, err := s.db.Query("SELECT COUNT(*) FROM content_plan WHERE status = 'planned'")
	if err != nil {
		return stats, err
	}
	defer rows2.Close()

	if rows2.Next() {
		var count int
		rows2.Scan(&count)
		stats["planned"] = count
	}

	return stats, nil
}

// GetRecentLogs возвращает последние логи
func (s *Storage) GetRecentLogs(limit int) ([]models.LogEntry, error) {
	query := "SELECT id, action, detail, status, created_at FROM logs ORDER BY created_at DESC LIMIT ?"
	rows, err := s.db.Query(query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []models.LogEntry
	for rows.Next() {
		var log models.LogEntry
		rows.Scan(&log.ID, &log.Action, &log.Detail, &log.Status, &log.CreatedAt)
		logs = append(logs, log)
	}
	return logs, nil
}
