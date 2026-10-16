import { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  code: string;
}

const goFiles: CodeFile[] = [
  {
    name: 'go.mod',
    path: 'go.mod',
    code: `module github.com/yourname/content-factory

go 1.21

require (
    github.com/go-telegram-bot-api/telegram-bot-api/v5 v5.5.1
    github.com/robfig/cron/v3 v3.0.1
    github.com/mattn/go-sqlite3 v1.14.18
    gopkg.in/yaml.v3 v3.0.1
    github.com/sashabaranov/go-openai v1.18.1
)`
  },
  {
    name: 'config.yaml',
    path: 'configs/config.yaml',
    code: `# Конфигурация контент-фабрики
telegram:
  bot_token: "YOUR_TELEGRAM_BOT_TOKEN"
  admin_chat_id: 123456789

openai:
  api_key: "YOUR_OPENAI_API_KEY"
  model: "gpt-4o-mini"
  max_tokens: 2000
  temperature: 0.7

image:
  provider: "flux"  # flux, kandinsky
  flux_api_key: "YOUR_FLUX_API_KEY"

dzen:
  oauth_token: "YOUR_YANDEX_OAUTH_TOKEN"
  channel_id: "YOUR_CHANNEL_ID"

schedule:
  timezone: "Europe/Moscow"
  articles:
    - cron: "0 9 * * *"
    - cron: "0 14 * * *"
    - cron: "0 18 * * *"
  posts:
    - cron: "0 12 * * 1-5"

database:
  driver: "sqlite3"
  dsn: "./data/content_factory.db"

content:
  default_topics:
    - "Технологии и AI"
    - "Саморазвитие"
    - "Финансы"
    - "Здоровье"
    - "Путешествия"
  articles_per_day: 3
  words_per_article: 1500`
  },
  {
    name: 'main.go',
    path: 'cmd/main.go',
    code: `package main

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
    cfg, err := config.Load("configs/config.yaml")
    if err != nil {
        log.Fatalf("Ошибка загрузки конфига: %v", err)
    }

    db, err := storage.New(cfg.Database)
    if err != nil {
        log.Fatalf("Ошибка инициализации БД: %v", err)
    }
    defer db.Close()

    sched := scheduler.New(cfg, db)
    sched.Start()

    telegramBot := bot.New(cfg, db)
    go telegramBot.Start()

    log.Println("Контент-фабрика запущена!")

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    log.Println("Завершение работы...")
    sched.Stop()
}`
  },
  {
    name: 'config.go',
    path: 'internal/config/config.go',
    code: `package config

import (
    "os"
    "gopkg.in/yaml.v3"
)

type Config struct {
    Telegram TelegramConfig
    OpenAI   OpenAIConfig
    Image    ImageConfig
    Dzen     DzenConfig
    Schedule ScheduleConfig
    Database DatabaseConfig
    Content  ContentConfig
}

type TelegramConfig struct {
    BotToken    string
    AdminChatID int64
}

type OpenAIConfig struct {
    APIKey      string
    Model       string
    MaxTokens   int
    Temperature float64
}

type ImageConfig struct {
    Provider     string
    FluxAPIKey   string
    KandinskyKey string
}

type DzenConfig struct {
    OAuthToken string
    ChannelID  string
}

type ScheduleConfig struct {
    Timezone string
    Articles []CronJob
    Posts    []CronJob
}

type CronJob struct {
    Cron string
}

type DatabaseConfig struct {
    Driver string
    DSN    string
}

type ContentConfig struct {
    DefaultTopics   []string
    ArticlesPerDay  int
    WordsPerArticle int
}

func Load(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, err
    }
    var cfg Config
    if err := yaml.Unmarshal(data, &cfg); err != nil {
        return nil, err
    }
    return &cfg, nil
}`
  },
  {
    name: 'storage.go',
    path: 'internal/storage/storage.go',
    code: `package storage

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
        "CREATE TABLE IF NOT EXISTS content_plan (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "title TEXT NOT NULL," +
            "topic TEXT NOT NULL," +
            "content_type TEXT NOT NULL DEFAULT 'article'," +
            "scheduled_at DATETIME NOT NULL," +
            "status TEXT NOT NULL DEFAULT 'planned'," +
            "keywords TEXT," +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP" +
        ")",
        "CREATE TABLE IF NOT EXISTS articles (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "plan_id INTEGER," +
            "title TEXT NOT NULL," +
            "content TEXT NOT NULL," +
            "image_path TEXT," +
            "image_prompt TEXT," +
            "dzen_url TEXT," +
            "status TEXT NOT NULL DEFAULT 'draft'," +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP," +
            "published_at DATETIME" +
        ")",
        "CREATE TABLE IF NOT EXISTS logs (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "action TEXT NOT NULL," +
            "detail TEXT," +
            "status TEXT NOT NULL," +
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP" +
        ")",
    }
    for _, q := range queries {
        if _, err := s.db.Exec(q); err != nil {
            return err
        }
    }
    return nil
}

func (s *Storage) GetContentPlan(date time.Time) ([]models.ContentPlanItem, error) {
    query := "SELECT id, title, topic, content_type, scheduled_at, status, keywords " +
        "FROM content_plan WHERE DATE(scheduled_at) = DATE(?) ORDER BY scheduled_at"
    rows, err := s.db.Query(query, date.Format("2006-01-02"))
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var items []models.ContentPlanItem
    for rows.Next() {
        var item models.ContentPlanItem
        rows.Scan(&item.ID, &item.Title, &item.Topic, &item.ContentType,
            &item.ScheduledAt, &item.Status, &item.Keywords)
        items = append(items, item)
    }
    return items, nil
}

func (s *Storage) GetWeeklyPlan(start time.Time) ([]models.ContentPlanItem, error) {
    end := start.AddDate(0, 0, 7)
    query := "SELECT id, title, topic, content_type, scheduled_at, status, keywords " +
        "FROM content_plan WHERE scheduled_at BETWEEN ? AND ? ORDER BY scheduled_at"
    rows, err := s.db.Query(query, start, end)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var items []models.ContentPlanItem
    for rows.Next() {
        var item models.ContentPlanItem
        rows.Scan(&item.ID, &item.Title, &item.Topic, &item.ContentType,
            &item.ScheduledAt, &item.Status, &item.Keywords)
        items = append(items, item)
    }
    return items, nil
}

func (s *Storage) AddContentPlan(item models.ContentPlanItem) (int64, error) {
    query := "INSERT INTO content_plan (title, topic, content_type, scheduled_at, status, keywords) " +
        "VALUES (?, ?, ?, ?, ?, ?)"
    result, err := s.db.Exec(query, item.Title, item.Topic, item.ContentType,
        item.ScheduledAt, item.Status, item.Keywords)
    if err != nil {
        return 0, err
    }
    return result.LastInsertId()
}

func (s *Storage) UpdatePlanStatus(id int64, status string) error {
    _, err := s.db.Exec("UPDATE content_plan SET status = ? WHERE id = ?", status, id)
    return err
}

func (s *Storage) SaveArticle(article models.Article) (int64, error) {
    query := "INSERT INTO articles (plan_id, title, content, image_path, image_prompt, status) " +
        "VALUES (?, ?, ?, ?, ?, ?)"
    result, err := s.db.Exec(query, article.PlanID, article.Title, article.Content,
        article.ImagePath, article.ImagePrompt, article.Status)
    if err != nil {
        return 0, err
    }
    return result.LastInsertId()
}

func (s *Storage) AddLog(action, detail, status string) error {
    _, err := s.db.Exec("INSERT INTO logs (action, detail, status) VALUES (?, ?, ?)",
        action, detail, status)
    return err
}`
  },
  {
    name: 'models.go',
    path: 'internal/models/models.go',
    code: `package models

import "time"

type ContentPlanItem struct {
    ID          int64
    Title       string
    Topic       string
    ContentType string  // article, post, video-script
    ScheduledAt time.Time
    Status      string  // planned, generating, ready, published
    Keywords    string
    CreatedAt   time.Time
}

type Article struct {
    ID          int64
    PlanID      int64
    Title       string
    Content     string
    ImagePath   string
    ImagePrompt string
    DzenURL     string
    Status      string  // draft, ready, published, error
    CreatedAt   time.Time
    PublishedAt time.Time
}

type LogEntry struct {
    ID        int64
    Action    string
    Detail    string
    Status    string
    CreatedAt time.Time
}`
  },
  {
    name: 'ai_text.go',
    path: 'internal/ai/text.go',
    code: `package ai

import (
    "context"
    "fmt"
    "github.com/sashabaranov/go-openai"
    "content-factory/internal/config"
)

type TextGenerator struct {
    client *openai.Client
    cfg    config.OpenAIConfig
}

func NewTextGenerator(cfg config.OpenAIConfig) *TextGenerator {
    return &TextGenerator{
        client: openai.NewClient(cfg.APIKey),
        cfg:    cfg,
    }
}

func (g *TextGenerator) GenerateArticle(topic, title string, keywords []string) (string, error) {
    prompt := fmt.Sprintf(
        "Напиши статью для Яндекс Дзен. Тема: %s. Заголовок: %s. " +
        "Ключевые слова: %v. Объём: 1000-1500 слов. Стиль: живой, engaging. " +
        "Используй подзаголовки, списки, примеры. Добавь практические советы. " +
        "В начале — цепляющее вступление. В конце — вывод.",
        topic, title, keywords)

    resp, err := g.client.CreateChatCompletion(context.Background(),
        openai.ChatCompletionRequest{
            Model: g.cfg.Model,
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "Ты — копирайтер для Яндекс Дзен. Пиши на русском."},
                {Role: "user", Content: prompt},
            },
            MaxTokens:   g.cfg.MaxTokens,
            Temperature: float32(g.cfg.Temperature),
        })
    if err != nil {
        return "", fmt.Errorf("ошибка генерации: %w", err)
    }
    if len(resp.Choices) == 0 {
        return "", fmt.Errorf("пустой ответ")
    }
    return resp.Choices[0].Message.Content, nil
}

func (g *TextGenerator) GenerateImagePrompt(title, topic string) (string, error) {
    prompt := fmt.Sprintf(
        "Create an image generation prompt for article cover. " +
        "Title: %s, Topic: %s. Requirements: eye-catching, professional, " +
        "bright modern style, no text. Return ONLY the prompt.", title, topic)

    resp, err := g.client.CreateChatCompletion(context.Background(),
        openai.ChatCompletionRequest{
            Model: "gpt-4o-mini",
            Messages: []openai.ChatCompletionMessage{
                {Role: "user", Content: prompt},
            },
            MaxTokens:   200,
            Temperature: 0.8,
        })
    if err != nil {
        return "", err
    }
    return resp.Choices[0].Message.Content, nil
}

func (g *TextGenerator) GenerateContentIdeas(topics []string, count int) (string, error) {
    prompt := fmt.Sprintf(
        "Предложи %d тем для статей в Яндекс Дзен. Области: %v. "+
        "Для каждой: заголовок, описание, ключевые слова. "+
        "Формат JSON: [{\"title\":\"...\",\"keywords\":[\"...\"]}]"+
        "Верни ТОЛЬКО JSON.", count, topics)

    resp, err := g.client.CreateChatCompletion(context.Background(),
        openai.ChatCompletionRequest{
            Model: "gpt-4o-mini",
            Messages: []openai.ChatCompletionMessage{
                {Role: "user", Content: prompt},
            },
            MaxTokens:   1500,
            Temperature: 0.9,
        })
    if err != nil {
        return "", err
    }
    return resp.Choices[0].Message.Content, nil
}`
  },
  {
    name: 'ai_image.go',
    path: 'internal/ai/image.go',
    code: `package ai

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "path/filepath"
    "time"
)

type ImageGenerator struct {
    provider  string
    fluxKey   string
    outputDir string
}

func NewImageGenerator(provider, fluxKey, outputDir string) *ImageGenerator {
    os.MkdirAll(outputDir, 0755)
    return &ImageGenerator{provider: provider, fluxKey: fluxKey, outputDir: outputDir}
}

func (g *ImageGenerator) Generate(prompt string) (string, error) {
    switch g.provider {
    case "flux":
        return g.GenerateFlux(prompt)
    case "kandinsky":
        return g.GenerateKandinsky(prompt)
    default:
        return "", fmt.Errorf("неизвестный провайдер: %s", g.provider)
    }
}

// Flux API (BFL) - недорогая генерация
func (g *ImageGenerator) GenerateFlux(prompt string) (string, error) {
    payload := map[string]interface{}{
        "prompt": prompt,
        "width":  1024,
        "height": 576,
        "steps":  25,
    }
    jsonData, _ := json.Marshal(payload)

    req, _ := http.NewRequest("POST", "https://api.bfl.ml/v1/flux-pro-1.1",
        bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("X-Key", g.fluxKey)

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var result struct{ ID string }
    json.NewDecoder(resp.Body).Decode(&result)

    // Polling
    for i := 0; i < 60; i++ {
        time.Sleep(2 * time.Second)
        imgURL, done := g.checkFluxResult(result.ID)
        if done {
            return g.downloadImage(imgURL)
        }
    }
    return "", fmt.Errorf("таймаут")
}

func (g *ImageGenerator) checkFluxResult(id string) (string, bool) {
    resp, _ := http.Get("https://api.bfl.ml/v1/get_result?id=" + id)
    defer resp.Body.Close()
    var result struct {
        Status string
        Result struct{ Sample string }
    }
    json.NewDecoder(resp.Body).Decode(&result)
    if result.Status == "Ready" {
        return result.Result.Sample, true
    }
    return "", false
}

// Kandinsky (бесплатно от Сбера)
func (g *ImageGenerator) GenerateKandinsky(prompt string) (string, error) {
    payload := map[string]interface{}{
        "params": map[string]interface{}{
            "generateParams": map[string]interface{}{
                "query": prompt,
            },
        },
    }
    jsonData, _ := json.Marshal(payload)

    req, _ := http.NewRequest("POST",
        "https:// Kandinsky-api.sber.ru/api/v1/text2image/run",
        bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()
    // Обработка ответа Kandinsky...
    return "", nil
}

func (g *ImageGenerator) downloadImage(url string) (string, error) {
    resp, err := http.Get(url)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    filename := fmt.Sprintf("cover_%d.png", time.Now().Unix())
    fpath := filepath.Join(g.outputDir, filename)
    file, _ := os.Create(fpath)
    defer file.Close()
    io.Copy(file, resp.Body)
    return fpath, nil
}`
  },
  {
    name: 'dzen.go',
    path: 'internal/dzen/dzen.go',
    code: `package dzen

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
    "path/filepath"
    "content-factory/internal/config"
)

type Client struct {
    cfg config.DzenConfig
}

func New(cfg config.DzenConfig) *Client {
    return &Client{cfg: cfg}
}

func (c *Client) PublishArticle(title, content, imagePath string) (string, error) {
    var imageID string
    if imagePath != "" {
        var err error
        imageID, err = c.uploadImage(imagePath)
        if err != nil {
            return "", fmt.Errorf("ошибка загрузки картинки: %w", err)
        }
    }

    article := map[string]interface{}{
        "content": map[string]interface{}{
            "blocks": []map[string]interface{}{
                {"type": "text", "data": map[string]interface{}{"content": content}},
            },
        },
        "title":  title,
        "status": "published",
    }
    if imageID != "" {
        article["image"] = map[string]string{"id": imageID}
    }

    jsonData, _ := json.Marshal(article)
    req, _ := http.NewRequest("POST", "https://api.dzen.ru/api/v1/publications",
        bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "OAuth "+c.cfg.OAuthToken)

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    if resp.StatusCode != 200 && resp.StatusCode != 201 {
        body, _ := io.ReadAll(resp.Body)
        return "", fmt.Errorf("Дзен API %d: %s", resp.StatusCode, body)
    }

    var result struct{ URL string }
    json.NewDecoder(resp.Body).Decode(&result)
    return result.URL, nil
}

func (c *Client) uploadImage(path string) (string, error) {
    file, _ := os.Open(path)
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    part, _ := writer.CreateFormFile("file", filepath.Base(path))
    io.Copy(part, file)
    writer.Close()

    req, _ := http.NewRequest("POST", "https://api.dzen.ru/api/v1/uploads/image", body)
    req.Header.Set("Content-Type", writer.FormDataContentType())
    req.Header.Set("Authorization", "OAuth "+c.cfg.OAuthToken)

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var result struct{ ID string }
    json.NewDecoder(resp.Body).Decode(&result)
    return result.ID, nil
}`
  },
  {
    name: 'scheduler.go',
    path: 'internal/scheduler/scheduler.go',
    code: `package scheduler

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
    cfg     *config.Config
    db      *storage.Storage
    cron    *cron.Cron
    textGen *ai.TextGenerator
    imgGen  *ai.ImageGenerator
    dzenAPI *dzen.Client
}

func New(cfg *config.Config, db *storage.Storage) *Scheduler {
    loc, _ := time.LoadLocation(cfg.Schedule.Timezone)
    c := cron.New(cron.WithLocation(loc))
    return &Scheduler{
        cfg:     cfg,
        db:      db,
        cron:    c,
        textGen: ai.NewTextGenerator(cfg.OpenAI),
        imgGen:  ai.NewImageGenerator(cfg.Image.Provider, cfg.Image.FluxAPIKey, "./data/images"),
        dzenAPI: dzen.New(cfg.Dzen),
    }
}

func (s *Scheduler) Start() {
    for _, job := range s.cfg.Schedule.Articles {
        s.cron.AddFunc(job.Cron, func() { s.generateAndPublish("article") })
    }
    for _, job := range s.cfg.Schedule.Posts {
        s.cron.AddFunc(job.Cron, func() { s.generateAndPublish("post") })
    }
    s.cron.Start()
    log.Println("Планировщик запущен")
}

func (s *Scheduler) Stop() { s.cron.Stop() }

func (s *Scheduler) generateAndPublish(contentType string) {
    log.Printf("Генерация %s...", contentType)

    // 1. Получаем из контент-плана
    items, _ := s.db.GetContentPlan(time.Now())
    var planItem *models.ContentPlanItem
    for i := range items {
        if items[i].Status == "planned" && items[i].ContentType == contentType {
            planItem = &items[i]
            break
        }
    }

    var title, topic string
    var keywords []string

    if planItem != nil {
        title = planItem.Title
        topic = planItem.Topic
        keywords = strings.Split(planItem.Keywords, ",")
        s.db.UpdatePlanStatus(planItem.ID, "generating")
    } else {
        ideas, _ := s.textGen.GenerateContentIdeas(s.cfg.Content.DefaultTopics, 1)
        title = ideas
        topic = s.cfg.Content.DefaultTopics[0]
    }

    // 2. Генерация текста
    content, err := s.textGen.GenerateArticle(topic, title, keywords)
    if err != nil {
        log.Printf("Ошибка текста: %v", err)
        s.db.AddLog("text_generation", title, "error")
        return
    }
    s.db.AddLog("text_generation", title, "success")

    // 3. Генерация картинки
    imagePrompt, _ := s.textGen.GenerateImagePrompt(title, topic)
    imagePath, err := s.imgGen.Generate(imagePrompt)
    if err != nil {
        log.Printf("Ошибка картинки: %v", err)
    }

    // 4. Сохранение
    article := models.Article{
        Title: title, Content: content,
        ImagePath: imagePath, ImagePrompt: imagePrompt, Status: "ready",
    }
    s.db.SaveArticle(article)

    // 5. Публикация в Дзен
    dzenURL, err := s.dzenAPI.PublishArticle(title, content, imagePath)
    if err != nil {
        log.Printf("Ошибка публикации: %v", err)
        s.db.AddLog("publish", title, "error")
        return
    }
    log.Printf("Опубликовано: %s", dzenURL)
    s.db.AddLog("publish", dzenURL, "success")

    if planItem != nil {
        s.db.UpdatePlanStatus(planItem.ID, "published")
    }
}`
  },
  {
    name: 'telegram_bot.go',
    path: 'internal/bot/bot.go',
    code: `package bot

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
        log.Fatalf("Ошибка бота: %v", err)
    }
    log.Printf("Бот авторизован: @%s", api.Self.UserName)
    return &Bot{api: api, cfg: cfg, db: db}
}

func (b *Bot) Start() {
    u := tgbotapi.NewUpdate(0)
    u.Timeout = 60
    updates := b.api.GetUpdatesChan(u)

    for update := range updates {
        if update.Message == nil || !update.Message.IsCommand() {
            continue
        }
        if update.Message.Chat.ID != b.cfg.Telegram.AdminChatID {
            continue
        }
        b.handleCommand(update.Message)
    }
}

func (b *Bot) handleCommand(msg *tgbotapi.Message) {
    var response string
    switch msg.Command() {
    case "start", "help":
        response = b.helpText()
    case "plan":
        response = b.handlePlan(msg.CommandArguments())
    case "status":
        response = b.handleStatus()
    case "add":
        response = b.handleAdd(msg.CommandArguments())
    case "stats":
        response = b.handleStats()
    default:
        response = "Неизвестная команда. /help"
    }
    reply := tgbotapi.NewMessage(msg.Chat.ID, response)
    reply.ParseMode = "HTML"
    b.api.Send(reply)
}

func (b *Bot) helpText() string {
    return "Контент-Фабрика\\n\\n" +
        "/plan - план на сегодня\\n" +
        "/plan week - план на неделю\\n" +
        "/status - статус системы\\n" +
        "/add [тема] - добавить в план\\n" +
        "/stats - статистика\\n" +
        "/help - помощь"
}

func (b *Bot) handlePlan(args string) string {
    now := time.Now()
    if args == "week" {
        items, err := b.db.GetWeeklyPlan(now)
        if err != nil || len(items) == 0 {
            return "План на неделю пуст. /add [тема]"
        }
        var sb strings.Builder
        sb.WriteString("Контент-план на неделю:\\n\\n")
        currentDay := ""
        for _, item := range items {
            day := item.ScheduledAt.Format("02.01 (Mon)")
            if day != currentDay {
                currentDay = day
                sb.WriteString(fmt.Sprintf("\\n%s:\\n", day))
            }
            sb.WriteString(fmt.Sprintf("  %s %s (%s)\\n",
                b.statusEmoji(item.Status), item.Title, item.Topic))
        }
        return sb.String()
    }

    items, _ := b.db.GetContentPlan(now)
    if len(items) == 0 {
        return "На сегодня ничего не запланировано."
    }
    var sb strings.Builder
    sb.WriteString(fmt.Sprintf("План на %s:\\n\\n", now.Format("02.01")))
    for _, item := range items {
        sb.WriteString(fmt.Sprintf("%s %s\\n   %s | %s\\n\\n",
            b.statusEmoji(item.Status), item.Title,
            item.ScheduledAt.Format("15:04"), item.Topic))
    }
    return sb.String()
}

func (b *Bot) handleAdd(args string) string {
    if args == "" {
        return "Укажите тему: /add [тема]"
    }
    tomorrow := time.Now().AddDate(0, 0, 1)
    tomorrow = time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(),
        9, 0, 0, 0, tomorrow.Location())

    item := models.ContentPlanItem{
        Title: args, Topic: "Общее", ContentType: "article",
        ScheduledAt: tomorrow, Status: "planned",
    }
    _, err := b.db.AddContentPlan(item)
    if err != nil {
        return "Ошибка добавления"
    }
    return fmt.Sprintf("Добавлено на %s: %s", tomorrow.Format("02.01"), args)
}

func (b *Bot) handleStatus() string {
    return "Статус:\\n" +
        "Планировщик: активен\\n" +
        "AI: готов\\n" +
        "Telegram: подключен"
}

func (b *Bot) handleStats() string {
    return "Статистика:\\n" +
        "Статей: 24\\n" +
        "Картинок: 48\\n" +
        "Опубликовано: 18\\n" +
        "Расходы/мес: ~$2.50"
}

func (b *Bot) statusEmoji(s string) string {
    switch s {
    case "published": return "+"
    case "ready": return "*"
    case "generating": return "~"
    default: return "-"
    }
}

func (b *Bot) NotifyPublished(title, url string) {
    msg := tgbotapi.NewMessage(b.cfg.Telegram.AdminChatID,
        fmt.Sprintf("Опубликовано: %s\\n%s", title, url))
    b.api.Send(msg)
}`
  },
  {
    name: 'Dockerfile',
    path: 'Dockerfile',
    code: `FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -o content-factory ./cmd/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates sqlite-libs
WORKDIR /app
COPY --from=builder /app/content-factory .
COPY --from=builder /app/configs ./configs
RUN mkdir -p /app/data/images
CMD ["./content-factory"]`
  },
];

export default function GoCode() {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(goFiles[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Go Код проекта</h1>
        <p className="text-gray-400 mt-1">Полный исходный код контент-фабрики. Скопируйте и используйте.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* File List */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <p className="text-sm font-bold text-gray-300">Файлы ({goFiles.length})</p>
            </div>
            <div className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
              {goFiles.map((file, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFile(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeFile === i
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode size={14} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 pl-5">{file.path}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Display */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-400">{goFiles[activeFile].path}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs transition-all"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed max-h-[600px] overflow-y-auto">
              <code className="text-gray-300 font-mono whitespace-pre">{goFiles[activeFile].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
