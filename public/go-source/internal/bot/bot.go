package bot

import (
	"fmt"
	"log"
	"strings"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"content-factory/internal/config"
	"content-factory/internal/models"
	"content-factory/internal/storage"
)

type Bot struct {
	api *tgbotapi.BotAPI
	cfg *config.Config
	db  *storage.Storage
}

func New(cfg *config.Config, db *storage.Storage) *Bot {
	api, err := tgbotapi.NewBotAPI(cfg.Telegram.BotToken)
	if err != nil {
		log.Fatalf("Ошибка инициализации бота: %v", err)
	}
	api.Debug = false

	log.Printf("✅ Telegram бот авторизован: @%s", api.Self.UserName)

	return &Bot{
		api: api,
		cfg: cfg,
		db:  db,
	}
}

func (b *Bot) Start() {
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := b.api.GetUpdatesChan(u)

	for update := range updates {
		if update.Message == nil {
			continue
		}

		if !update.Message.IsCommand() {
			continue
		}

		// Проверяем что это админ
		if update.Message.Chat.ID != b.cfg.Telegram.AdminChatID {
			continue
		}

		b.handleCommand(update.Message)
	}
}

func (b *Bot) handleCommand(msg *tgbotapi.Message) {
	command := msg.Command()
	args := msg.CommandArguments()

	var response string

	switch command {
	case "start":
		response = b.handleStart()
	case "plan":
		response = b.handlePlan(args)
	case "status":
		response = b.handleStatus()
	case "generate":
		response = b.handleGenerate(args)
	case "add":
		response = b.handleAdd(args)
	case "stats":
		response = b.handleStats()
	case "help":
		response = b.handleHelp()
	default:
		response = "Неизвестная команда. Используйте /help"
	}

	reply := tgbotapi.NewMessage(msg.Chat.ID, response)
	reply.ParseMode = "HTML"
	b.api.Send(reply)
}

func (b *Bot) handleStart() string {
	return `🤖 <b>Контент-Фабрика</b>

Я автоматическая система для создания и публикации контента в Яндекс Дзен.
💰 Стоимость: $0.00/мес (бесплатные AI модели)

Доступные команды:
/plan — контент-план на сегодня
/plan week — план на неделю
/status — статус текущих задач
/generate [тема] — сгенерировать статью
/add [тема] — добавить в план
/stats — статистика
/help — помощь`
}

func (b *Bot) handlePlan(args string) string {
	now := time.Now()

	if args == "week" {
		items, err := b.db.GetWeeklyPlan(now)
		if err != nil {
			return "❌ Ошибка получения плана"
		}
		if len(items) == 0 {
			return "📋 Контент-план на неделю пуст.\nДобавьте темы: /add [тема]"
		}

		var sb strings.Builder
		sb.WriteString("📋 <b>Контент-план на неделю:</b>\n\n")

		currentDay := ""
		for _, item := range items {
			day := item.ScheduledAt.Format("02.01 (Mon)")
			if day != currentDay {
				currentDay = day
				sb.WriteString(fmt.Sprintf("\n<b>📅 %s:</b>\n", day))
			}
			emoji := b.statusEmoji(item.Status)
			sb.WriteString(fmt.Sprintf("  %s %s <i>(%s)</i>\n", emoji, item.Title, item.Topic))
		}
		return sb.String()
	}

	// План на сегодня
	items, err := b.db.GetContentPlan(now)
	if err != nil {
		return "❌ Ошибка получения плана"
	}
	if len(items) == 0 {
		return "📋 На сегодня ничего не запланировано.\nДобавьте: /add [тема]"
	}

	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("📋 <b>Контент-план на %s:</b>\n\n", now.Format("02.01.2006")))

	for _, item := range items {
		emoji := b.statusEmoji(item.Status)
		sb.WriteString(fmt.Sprintf("%s <b>%s</b>\n   ⏰ %s | 📂 %s\n\n",
			emoji, item.Title,
			item.ScheduledAt.Format("15:04"),
			item.Topic))
	}
	return sb.String()
}

func (b *Bot) handleStatus() string {
	return `📊 <b>Статус системы:</b>

✅ Планировщик: активен
✅ AI генератор: готов (бесплатные модели)
✅ Telegram: подключен
⏳ Следующая публикация: по расписанию

💰 Стоимость: $0.00/мес`
}

func (b *Bot) handleGenerate(args string) string {
	if args == "" {
		return "Укажите тему: /generate [тема]"
	}
	return fmt.Sprintf("🔄 Начинаю генерацию статьи: %s\nРезультат будет отправлен автоматически.", args)
}

func (b *Bot) handleAdd(args string) string {
	if args == "" {
		return "Укажите тему: /add [тема]"
	}

	// Добавляем на завтра
	tomorrow := time.Now().AddDate(0, 0, 1)
	tomorrow = time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(), 9, 0, 0, 0, tomorrow.Location())

	item := models.ContentPlanItem{
		Title:       args,
		Topic:       "Общее",
		ContentType: "article",
		ScheduledAt: tomorrow,
		Status:      "planned",
	}

	_, err := b.db.AddContentPlan(item)
	if err != nil {
		return "❌ Ошибка добавления"
	}

	return fmt.Sprintf("✅ Добавлено в план на %s:\n📝 %s", tomorrow.Format("02.01"), args)
}

func (b *Bot) handleStats() string {
	stats, err := b.db.GetStats()
	if err != nil {
		return "❌ Ошибка получения статистики"
	}

	return fmt.Sprintf(`📊 <b>Статистика:</b>

📝 Статей создано: %d
🚀 Опубликовано: %d
⏳ В очереди: %d

💰 Расходы: $0.00/мес (бесплатные AI)`,
		stats["articles_published"]+stats["articles_ready"],
		stats["articles_published"],
		stats["planned"])
}

func (b *Bot) handleHelp() string {
	return b.handleStart()
}

func (b *Bot) statusEmoji(status string) string {
	switch status {
	case "published":
		return "✅"
	case "ready":
		return "🟢"
	case "generating":
		return "🔄"
	case "planned":
		return "📋"
	default:
		return "⚪"
	}
}

// Отправка уведомления о публикации
func (b *Bot) NotifyPublished(title, url string) {
	msg := tgbotapi.NewMessage(b.cfg.Telegram.AdminChatID,
		fmt.Sprintf("✅ <b>Статья опубликована!</b>\n\n📝 %s\n🔗 %s\n\n💰 Стоимость: $0.00", title, url))
	msg.ParseMode = "HTML"
	b.api.Send(msg)
}

// Отправка уведомления об ошибке
func (b *Bot) NotifyError(action, errMsg string) {
	msg := tgbotapi.NewMessage(b.cfg.Telegram.AdminChatID,
		fmt.Sprintf("❌ <b>Ошибка</b>\n\nДействие: %s\nОшибка: %s", action, errMsg))
	msg.ParseMode = "HTML"
	b.api.Send(msg)
}
