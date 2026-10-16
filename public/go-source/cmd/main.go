package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"content-factory/internal/bot"
	"content-factory/internal/config"
	"content-factory/internal/scheduler"
	"content-factory/internal/storage"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.Println("🚀 Запуск контент-фабрики...")

	// Загрузка конфигурации
	cfgPath := "configs/config.yaml"
	if envPath := os.Getenv("CONFIG_PATH"); envPath != "" {
		cfgPath = envPath
	}

	cfg, err := config.Load(cfgPath)
	if err != nil {
		log.Fatalf("❌ Ошибка загрузки конфига: %v", err)
	}
	log.Printf("✅ Конфиг загружен (текст: %s, картинки: %s)", cfg.Text.Provider, cfg.Image.Provider)

	// Создание папки для данных
	os.MkdirAll("./data/images", 0755)

	// Инициализация БД
	db, err := storage.New(cfg.Database)
	if err != nil {
		log.Fatalf("❌ Ошибка инициализации БД: %v", err)
	}
	defer db.Close()
	log.Println("✅ База данных готова")

	// Запуск планировщика
	sched := scheduler.New(cfg, db)
	sched.Start()

	// Запуск Telegram бота
	telegramBot := bot.New(cfg, db)
	go telegramBot.Start()

	log.Println("🎉 Контент-фабрика запущена!")
	log.Println("📊 Используйте Telegram бота для управления")
	log.Println("💰 Стоимость: $0.00/мес (бесплатные модели)")

	// Ожидание сигнала завершения
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Завершение работы...")
	sched.Stop()
	log.Println("👋 До свидания!")
}
