package scheduler

import (
	"log"
	"strings"
	"time"

	"github.com/robfig/cron/v3"
	"content-factory/internal/ai"
	"content-factory/internal/config"
	"content-factory/internal/dzen"
	"content-factory/internal/models"
	"content-factory/internal/storage"
)

type Scheduler struct {
	cfg          *config.Config
	db           *storage.Storage
	cron         *cron.Cron
	textProvider ai.TextProvider
	imgProvider  ai.ImageProvider
	dzenAPI      *dzen.Client
}

func New(cfg *config.Config, db *storage.Storage) *Scheduler {
	loc, err := time.LoadLocation(cfg.Schedule.Timezone)
	if err != nil {
		loc = time.UTC
	}
	c := cron.New(cron.WithLocation(loc))

	// Создаём провайдер текста
	var textProvider ai.TextProvider
	switch cfg.Text.Provider {
	case "ollama":
		textProvider = ai.NewOllamaClient(cfg.Text.Ollama.URL, cfg.Text.Ollama.Model)
	case "groq":
		textProvider = ai.NewGroqClient(cfg.Text.Groq.APIKey, cfg.Text.Groq.Model)
	case "gemini":
		textProvider = ai.NewGeminiClient(cfg.Text.Gemini.APIKey, cfg.Text.Gemini.Model)
	case "huggingface":
		textProvider = ai.NewHFTextClient(cfg.Text.HuggingFace.APIKey, cfg.Text.HuggingFace.Model)
	default:
		log.Fatalf("Неизвестный провайдер текста: %s", cfg.Text.Provider)
	}

	// Создаём провайдер картинок
	var imgProvider ai.ImageProvider
	switch cfg.Image.Provider {
	case "pollinations":
		imgProvider = ai.NewPollinationsClient(cfg.Image.OutputDir)
	case "kandinsky":
		imgProvider = ai.NewKandinskyClient(cfg.Image.Kandinsky.AuthKey, cfg.Image.Kandinsky.Scope, cfg.Image.OutputDir)
	case "huggingface":
		imgProvider = ai.NewHFImageClient(cfg.Image.HuggingFace.APIKey, cfg.Image.HuggingFace.Model, cfg.Image.OutputDir)
	default:
		log.Fatalf("Неизвестный провайдер картинок: %s", cfg.Image.Provider)
	}

	return &Scheduler{
		cfg:          cfg,
		db:           db,
		cron:         c,
		textProvider: textProvider,
		imgProvider:  imgProvider,
		dzenAPI:      dzen.New(cfg.Dzen),
	}
}

func (s *Scheduler) Start() {
	// Добавляем задачи для статей
	for _, job := range s.cfg.Schedule.Articles {
		_, err := s.cron.AddFunc(job.Cron, func() {
			s.generateAndPublish("article")
		})
		if err != nil {
			log.Printf("Ошибка добавления cron задачи: %v", err)
		}
	}

	// Добавляем задачи для постов
	for _, job := range s.cfg.Schedule.Posts {
		_, err := s.cron.AddFunc(job.Cron, func() {
			s.generateAndPublish("post")
		})
		if err != nil {
			log.Printf("Ошибка добавления cron задачи: %v", err)
		}
	}

	s.cron.Start()
	log.Printf("⏰ Планировщик запущен (текст: %s, картинки: %s)",
		s.cfg.Text.Provider, s.cfg.Image.Provider)
}

func (s *Scheduler) Stop() {
	s.cron.Stop()
}

// Основной процесс генерации и публикации
func (s *Scheduler) generateAndPublish(contentType string) {
	log.Printf("🔄 Начинаю генерацию %s...", contentType)

	// 1. Получаем следующий элемент из контент-плана
	items, err := s.db.GetContentPlan(time.Now())
	if err != nil {
		log.Printf("Ошибка получения плана: %v", err)
		return
	}

	var planItem *models.ContentPlanItem
	for i := range items {
		if items[i].Status == "planned" && items[i].ContentType == contentType {
			planItem = &items[i]
			break
		}
	}

	// Если нет запланированного — генерируем идею
	var title, topic string
	var keywords []string

	if planItem != nil {
		title = planItem.Title
		topic = planItem.Topic
		keywords = strings.Split(planItem.Keywords, ",")
		s.db.UpdatePlanStatus(planItem.ID, "generating")
	} else {
		// AI генерирует идею сам
		ideas, err := s.textProvider.GenerateContentIdeas(s.cfg.Content.DefaultTopics, 1)
		if err != nil {
			log.Printf("Ошибка генерации идеи: %v", err)
			return
		}
		title = ideas // Упрощённо
		topic = s.cfg.Content.DefaultTopics[0]
	}

	// 2. Генерация текста (бесплатно!)
	log.Printf("📝 Генерирую текст: %s", title)
	content, err := s.textProvider.GenerateArticle(topic, title, keywords)
	if err != nil {
		log.Printf("Ошибка генерации текста: %v", err)
		s.db.AddLog("text_generation", title, "error")
		return
	}
	s.db.AddLog("text_generation", title, "success")

	// 3. Генерация промпта для картинки и сама картинка (бесплатно!)
	log.Printf("🎨 Генерирую обложку...")
	imagePrompt, err := s.textProvider.GenerateImagePrompt(title, topic)
	if err != nil {
		log.Printf("Ошибка генерации промпта картинки: %v", err)
		imagePrompt = "Professional blog cover for " + topic
	}

	imagePath, err := s.imgProvider.Generate(imagePrompt)
	if err != nil {
		log.Printf("Ошибка генерации картинки: %v", err)
		s.db.AddLog("image_generation", title, "error")
		// Продолжаем без картинки
	} else {
		s.db.AddLog("image_generation", title, "success")
	}

	// 4. Сохраняем статью
	article := models.Article{
		Title:       title,
		Content:     content,
		ImagePath:   imagePath,
		ImagePrompt: imagePrompt,
		Status:      "ready",
	}
	articleID, _ := s.db.SaveArticle(article)
	log.Printf("💾 Статья сохранена (ID: %d)", articleID)

	// 5. Публикация в Дзен
	log.Printf("🚀 Публикую в Яндекс Дзен...")
	dzenURL, err := s.dzenAPI.PublishArticle(title, content, imagePath)
	if err != nil {
		log.Printf("Ошибка публикации: %v", err)
		s.db.AddLog("publish_dzen", title, "error")
		return
	}

	log.Printf("✅ Опубликовано: %s", dzenURL)
	s.db.AddLog("publish_dzen", dzenURL, "success")

	if planItem != nil {
		s.db.UpdatePlanStatus(planItem.ID, "published")
	}
}
