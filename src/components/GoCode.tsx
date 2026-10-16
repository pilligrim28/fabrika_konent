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
)`
  },
  {
    name: 'config.yaml',
    path: 'configs/config.yaml',
    code: `# Конфигурация контент-фабрики (БЕСПЛАТНЫЕ модели)
telegram:
  bot_token: "YOUR_TELEGRAM_BOT_TOKEN"
  admin_chat_id: 123456789

# === БЕСПЛАТНЫЕ AI МОДЕЛИ ДЛЯ ТЕКСТА ===
text:
  # Вариант 1: Ollama (локально, полностью бесплатно)
  provider: "ollama"
  ollama:
    url: "http://localhost:11434"
    model: "llama3.1"  # или mistral, qwen2.5, gemma2
  
  # Вариант 2: Groq (бесплатно, быстро)
  # provider: "groq"
  # groq:
  #   api_key: "YOUR_GROQ_API_KEY"
  #   model: "llama-3.1-8b-instant"
  
  # Вариант 3: Google Gemini (бесплатный тариф)
  # provider: "gemini"
  # gemini:
  #   api_key: "YOUR_GEMINI_API_KEY"
  #   model: "gemini-1.5-flash"
  
  # Вариант 4: HuggingFace (бесплатно)
  # provider: "huggingface"
  # huggingface:
  #   api_key: "YOUR_HF_TOKEN"
  #   model: "mistralai/Mistral-7B-Instruct-v0.3"

  max_tokens: 2000
  temperature: 0.7

# === БЕСПЛАТНЫЕ AI МОДЕЛИ ДЛЯ КАРТИНОК ===
image:
  # Вариант 1: Pollinations.ai (полностью бесплатно, без ключа!)
  provider: "pollinations"
  
  # Вариант 2: Kandinsky от Сбера (бесплатно)
  # provider: "kandinsky"
  # kandinsky:
  #   auth_key: "YOUR_SBER_AUTH_KEY"
  #   scope: "YOUR_SCOPE"
  
  # Вариант 3: HuggingFace Stable Diffusion (бесплатно)
  # provider: "huggingface"
  # huggingface:
  #   api_key: "YOUR_HF_TOKEN"
  #   model: "stabilityai/stable-diffusion-xl-base-1.0"

  output_dir: "./data/images"

# === Яндекс Дзен ===
dzen:
  oauth_token: "YOUR_YANDEX_OAUTH_TOKEN"
  channel_id: "YOUR_CHANNEL_ID"

# === Расписание ===
schedule:
  timezone: "Europe/Moscow"
  articles:
    - cron: "0 9 * * *"
    - cron: "0 14 * * *"
    - cron: "0 18 * * *"
  posts:
    - cron: "0 12 * * 1-5"

# === База данных ===
database:
  driver: "sqlite3"
  dsn: "./data/content_factory.db"

# === Контент ===
content:
  default_topics:
    - "Технологии и AI"
    - "Саморазвитие"
    - "Финансы"
    - "Здоровье"
    - "Путешествия"
    - "Кулинария"
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

    log.Println("Контент-фабрика запущена (бесплатные модели)!")

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
    Text     TextConfig
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

// Бесплатные провайдеры текста
type TextConfig struct {
    Provider    string        // ollama, groq, gemini, huggingface
    Ollama      OllamaConfig
    Groq        GroqConfig
    Gemini      GeminiConfig
    HuggingFace HFConfig
    MaxTokens   int
    Temperature float64
}

type OllamaConfig struct {
    URL   string
    Model string
}

type GroqConfig struct {
    APIKey string
    Model  string
}

type GeminiConfig struct {
    APIKey string
    Model  string
}

type HFConfig struct {
    APIKey string
    Model  string
}

// Бесплатные провайдеры картинок
type ImageConfig struct {
    Provider   string // pollinations, kandinsky, huggingface
    Kandinsky  KandinskyConfig
    HuggingFace HFImageConfig
    OutputDir  string
}

type KandinskyConfig struct {
    AuthKey string
    Scope   string
}

type HFImageConfig struct {
    APIKey string
    Model  string
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
    name: 'ai_ollama.go',
    path: 'internal/ai/ollama.go',
    code: `package ai

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

// Ollama - полностью бесплатная локальная генерация текста
// Установка: curl -fsSL https://ollama.com/install.sh | sh
// Модели: ollama pull llama3.1, ollama pull mistral, ollama pull qwen2.5

type OllamaClient struct {
    baseURL string
    model   string
}

func NewOllamaClient(baseURL, model string) *OllamaClient {
    return &OllamaClient{baseURL: baseURL, model: model}
}

type OllamaRequest struct {
    Model  string    \`json:"model"\`
    Prompt string    \`json:"prompt"\`
    Stream bool      \`json:"stream"\`
    System string    \`json:"system,omitempty"\`
}

type OllamaResponse struct {
    Response string \`json:"response"\`
    Done     bool   \`json:"done"\`
}

func (c *OllamaClient) Generate(system, prompt string) (string, error) {
    reqBody := OllamaRequest{
        Model:  c.model,
        Prompt: prompt,
        System: system,
        Stream: false,
    }

    jsonData, err := json.Marshal(reqBody)
    if err != nil {
        return "", err
    }

    resp, err := http.Post(
        c.baseURL+"/api/generate",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        return "", fmt.Errorf("Ollama недоступна. Запустите: ollama serve. Ошибка: %w", err)
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }

    var result OllamaResponse
    if err := json.Unmarshal(body, &result); err != nil {
        return "", fmt.Errorf("ошибка парсинга ответа Ollama: %w", err)
    }

    return result.Response, nil
}

// Генерация статьи
func (c *OllamaClient) GenerateArticle(topic, title string, keywords []string) (string, error) {
    system := "Ты — опытный копирайтер для Яндекс Дзен. Пиши интересные, полезные статьи на русском языке. Используй подзаголовки, списки, примеры. Объём 1000-1500 слов."
    
    prompt := fmt.Sprintf(
        "Напиши статью для Яндекс Дзен.\\n\\n"+
        "Тема: %s\\n"+
        "Заголовок: %s\\n"+
        "Ключевые слова: %v\\n\\n"+
        "Требования:\\n"+
        "- Объём: 1000-1500 слов\\n"+
        "- Стиль: живой, engaging\\n"+
        "- Используй подзаголовки и списки\\n"+
        "- Добавь практические советы\\n"+
        "- Цепляющее вступление\\n"+
        "- Вывод в конце\\n\\n"+
        "Статья:",
        topic, title, keywords,
    )

    return c.Generate(system, prompt)
}

// Генерация промпта для картинки
func (c *OllamaClient) GenerateImagePrompt(title, topic string) (string, error) {
    system := "You create image generation prompts. Return only the prompt in English, nothing else."
    
    prompt := fmt.Sprintf(
        "Create a detailed image generation prompt for an article cover.\\n"+
        "Article title: %s\\n"+
        "Topic: %s\\n\\n"+
        "Requirements: eye-catching, professional, bright modern style, no text.\\n"+
        "Return ONLY the image prompt:",
        title, topic,
    )

    return c.Generate(system, prompt)
}

// Генерация идей для контент-плана
func (c *OllamaClient) GenerateContentIdeas(topics []string, count int) (string, error) {
    system := "Ты — контент-менеджер. Предлагаешь интересные темы для статей."
    
    prompt := fmt.Sprintf(
        "Предложи %d интересных тем для статей в Яндекс Дзен.\\n"+
        "Области: %v\\n\\n"+
        "Для каждой темы укажи:\\n"+
        "1. Заголовок (цепляющий)\\n"+
        "2. Краткое описание\\n"+
        "3. Ключевые слова\\n\\n"+
        "Формат JSON: [{\"title\":\"...\",\"description\":\"...\",\"keywords\":[\"...\"]}]\\n"+
        "Верни ТОЛЬКО JSON:",
        count, topics,
    )

    return c.Generate(system, prompt)
}`
  },
  {
    name: 'ai_groq.go',
    path: 'internal/ai/groq.go',
    code: `package ai

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

// Groq - БЕСПЛАТНЫЙ API с очень быстрыми моделями
// Регистрация: https://console.groq.com
// Бесплатно: 30 запросов/мин, 14400 запросов/день
// Модели: llama-3.1-8b-instant, llama-3.1-70b-versatile, mixtral-8x7b-32768

type GroqClient struct {
    apiKey string
    model  string
}

func NewGroqClient(apiKey, model string) *GroqClient {
    return &GroqClient{apiKey: apiKey, model: model}
}

type GroqMessage struct {
    Role    string \`json:"role"\`
    Content string \`json:"content"\`
}

type GroqRequest struct {
    Model       string        \`json:"model"\`
    Messages    []GroqMessage \`json:"messages"\`
    MaxTokens   int           \`json:"max_tokens"\`
    Temperature float64       \`json:"temperature"\`
}

type GroqResponse struct {
    Choices []struct {
        Message struct {
            Content string \`json:"content"\`
        } \`json:"message"\`
    } \`json:"choices"\`
}

func (c *GroqClient) Generate(system, prompt string) (string, error) {
    reqBody := GroqRequest{
        Model: c.model,
        Messages: []GroqMessage{
            {Role: "system", Content: system},
            {Role: "user", Content: prompt},
        },
        MaxTokens:   2000,
        Temperature: 0.7,
    }

    jsonData, _ := json.Marshal(reqBody)

    req, _ := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions",
        bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer "+c.apiKey)

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", fmt.Errorf("ошибка Groq API: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != 200 {
        body, _ := io.ReadAll(resp.Body)
        return "", fmt.Errorf("Groq API error %d: %s", resp.StatusCode, body)
    }

    var result GroqResponse
    json.NewDecoder(resp.Body).Decode(&result)

    if len(result.Choices) == 0 {
        return "", fmt.Errorf("пустой ответ от Groq")
    }

    return result.Choices[0].Message.Content, nil
}

func (c *GroqClient) GenerateArticle(topic, title string, keywords []string) (string, error) {
    system := "Ты — опытный копирайтер для Яндекс Дзен. Пиши интересные, полезные статьи на русском языке. Используй подзаголовки, списки, примеры. Объём 1000-1500 слов."
    
    prompt := fmt.Sprintf(
        "Напиши статью для Яндекс Дзен.\\n\\n"+
        "Тема: %s\\nЗаголовок: %s\\nКлючевые слова: %v\\n\\n"+
        "Требования:\\n"+
        "- Объём: 1000-1500 слов\\n"+
        "- Стиль: живой, engaging\\n"+
        "- Используй подзаголовки и списки\\n"+
        "- Добавь практические советы\\n"+
        "- Цепляющее вступление\\n"+
        "- Вывод в конце\\n\\nСтатья:",
        topic, title, keywords,
    )

    return c.Generate(system, prompt)
}

func (c *GroqClient) GenerateImagePrompt(title, topic string) (string, error) {
    system := "You create image generation prompts. Return only the prompt in English."
    prompt := fmt.Sprintf(
        "Create image prompt for article cover. Title: %s, Topic: %s. "+
        "Eye-catching, professional, bright, no text. Return ONLY the prompt:",
        title, topic,
    )
    return c.Generate(system, prompt)
}

func (c *GroqClient) GenerateContentIdeas(topics []string, count int) (string, error) {
    system := "Ты — контент-менеджер."
    prompt := fmt.Sprintf(
        "Предложи %d тем для Яндекс Дзен. Области: %v. "+
        "Формат JSON: [{\"title\":\"...\",\"keywords\":[\"...\"]}]"+
        "Верни ТОЛЬКО JSON.", count, topics,
    )
    return c.Generate(system, prompt)
}`
  },
  {
    name: 'ai_gemini.go',
    path: 'internal/ai/gemini.go',
    code: `package ai

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

// Google Gemini - БЕСПЛАТНЫЙ тариф
// Регистрация: https://aistudio.google.com/app/apikey
// Бесплатно: 15 запросов/мин (Gemini 1.5 Flash)
// Модели: gemini-1.5-flash, gemini-1.5-pro

type GeminiClient struct {
    apiKey string
    model  string
}

func NewGeminiClient(apiKey, model string) *GeminiClient {
    return &GeminiClient{apiKey: apiKey, model: model}
}

type GeminiContent struct {
    Parts []struct {
        Text string \`json:"text"\`
    } \`json:"parts"\`
    Role string \`json:"role"\`
}

type GeminiRequest struct {
    Contents         []GeminiContent \`json:"contents"\`
    SystemInstruction *GeminiContent  \`json:"system_instruction,omitempty"\`
    GenerationConfig struct {
        MaxOutputTokens int     \`json:"maxOutputTokens"\`
        Temperature     float64 \`json:"temperature"\`
    } \`json:"generationConfig"\`
}

type GeminiResponse struct {
    Candidates []struct {
        Content struct {
            Parts []struct {
                Text string \`json:"text"\`
            } \`json:"parts"\`
        } \`json:"content"\`
    } \`json:"candidates"\`
}

func (c *GeminiClient) Generate(system, prompt string) (string, error) {
    url := fmt.Sprintf(
        "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
        c.model, c.apiKey,
    )

    reqBody := GeminiRequest{
        Contents: []GeminiContent{
            {
                Parts: []struct {
                    Text string \`json:"text"\`
                }{{Text: prompt}},
                Role: "user",
            },
        },
    }

    if system != "" {
        reqBody.SystemInstruction = &GeminiContent{
            Parts: []struct {
                Text string \`json:"text"\`
            }{{Text: system}},
            Role: "system",
        }
    }

    reqBody.GenerationConfig.MaxOutputTokens = 2000
    reqBody.GenerationConfig.Temperature = 0.7

    jsonData, _ := json.Marshal(reqBody)

    resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        return "", fmt.Errorf("ошибка Gemini API: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != 200 {
        body, _ := io.ReadAll(resp.Body)
        return "", fmt.Errorf("Gemini API error %d: %s", resp.StatusCode, body)
    }

    var result GeminiResponse
    json.NewDecoder(resp.Body).Decode(&result)

    if len(result.Candidates) == 0 || len(result.Candidates[0].Content.Parts) == 0 {
        return "", fmt.Errorf("пустой ответ от Gemini")
    }

    return result.Candidates[0].Content.Parts[0].Text, nil
}

func (c *GeminiClient) GenerateArticle(topic, title string, keywords []string) (string, error) {
    system := "Ты — опытный копирайтер для Яндекс Дзен. Пиши интересные, полезные статьи на русском языке. Объём 1000-1500 слов."
    
    prompt := fmt.Sprintf(
        "Напиши статью для Яндекс Дзен.\\nТема: %s\\nЗаголовок: %s\\nКлючевые слова: %v\\n\\n"+
        "Требования: объём 1000-1500 слов, живой стиль, подзаголовки, списки, "+
        "практические советы, цепляющее вступление, вывод в конце.\\n\\nСтатья:",
        topic, title, keywords,
    )

    return c.Generate(system, prompt)
}

func (c *GeminiClient) GenerateImagePrompt(title, topic string) (string, error) {
    system := "You create image generation prompts. Return only the prompt in English."
    prompt := fmt.Sprintf(
        "Create image prompt for: %s (%s). Eye-catching, professional, no text. ONLY the prompt:",
        title, topic,
    )
    return c.Generate(system, prompt)
}

func (c *GeminiClient) GenerateContentIdeas(topics []string, count int) (string, error) {
    system := "Ты — контент-менеджер."
    prompt := fmt.Sprintf(
        "Предложи %d тем для Яндекс Дзен. Области: %v. "+
        "JSON: [{\"title\":\"...\",\"keywords\":[\"...\"]}] ТОЛЬКО JSON.", count, topics,
    )
    return c.Generate(system, prompt)
}`
  },
  {
    name: 'image_pollinations.go',
    path: 'internal/ai/image_pollinations.go',
    code: `package ai

import (
    "fmt"
    "io"
    "net/http"
    "net/url"
    "os"
    "path/filepath"
    "time"
)

// Pollinations.ai - ПОЛНОСТЬЮ БЕСПЛАТНАЯ генерация картинок
// НЕ ТРЕБУЕТ API КЛЮЧА!
// Просто HTTP GET запрос с промптом
// Документация: https://pollinations.ai

type PollinationsClient struct {
    outputDir string
}

func NewPollinationsClient(outputDir string) *PollinationsClient {
    os.MkdirAll(outputDir, 0755)
    return &PollinationsClient{outputDir: outputDir}
}

func (c *PollinationsClient) Generate(prompt string) (string, error) {
    // Формируем URL для Pollinations
    // Формат: https://image.pollinations.ai/prompt/{prompt}?width=1024&height=576&seed={random}
    encodedPrompt := url.PathEscape(prompt)
    seed := time.Now().UnixNano() % 100000
    
    imageURL := fmt.Sprintf(
        "https://image.pollinations.ai/prompt/%s?width=1024&height=576&seed=%d&nologo=true",
        encodedPrompt, seed,
    )

    // Скачиваем изображение
    resp, err := http.Get(imageURL)
    if err != nil {
        return "", fmt.Errorf("ошибка запроса к Pollinations: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != 200 {
        return "", fmt.Errorf("Pollinations вернул статус %d", resp.StatusCode)
    }

    // Сохраняем файл
    filename := fmt.Sprintf("cover_%d.jpg", time.Now().Unix())
    filepath := filepath.Join(c.outputDir, filename)

    file, err := os.Create(filepath)
    if err != nil {
        return "", fmt.Errorf("ошибка создания файла: %w", err)
    }
    defer file.Close()

    _, err = io.Copy(file, resp.Body)
    if err != nil {
        return "", fmt.Errorf("ошибка сохранения: %w", err)
    }

    return filepath, nil
}`
  },
  {
    name: 'image_kandinsky.go',
    path: 'internal/ai/image_kandinsky.go',
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

// Kandinsky от Сбера - БЕСПЛАТНАЯ генерация картинок
// Регистрация: https://developers.sber.ru/studio/workspaces
// Бесплатно: 1000 генераций в месяц!

type KandinskyClient struct {
    authKey   string
    scope     string
    outputDir string
}

func NewKandinskyClient(authKey, scope, outputDir string) *KandinskyClient {
    os.MkdirAll(outputDir, 0755)
    return &KandinskyClient{
        authKey:   authKey,
        scope:     scope,
        outputDir: outputDir,
    }
}

func (c *KandinskyClient) getAuthToken() (string, string, error) {
    // Получаем токен авторизации
    url := "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
    
    payload := "scope=" + c.scope
    req, _ := http.NewRequest("POST", url, bytes.NewBufferString(payload))
    req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
    req.Header.Set("Accept", "application/json")
    req.Header.Set("RqUID", fmt.Sprintf("req-%d", time.Now().Unix()))
    req.Header.Set("Authorization", "Basic "+c.authKey)

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", "", err
    }
    defer resp.Body.Close()

    var result struct {
        AccessToken string \`json:"access_token"\`
        ExpiresIn   int    \`json:"expires_in"\`
    }
    json.NewDecoder(resp.Body).Decode(&result)

    return result.AccessToken, "", nil
}

func (c *KandinskyClient) Generate(prompt string) (string, error) {
    // 1. Получаем токен
    token, _, err := c.getAuthToken()
    if err != nil {
        return "", fmt.Errorf("ошибка получения токена Kandinsky: %w", err)
    }

    // 2. Запускаем генерацию
    genURL := "https:// Kandinsky-api.sber.ru/api/v1/text2image/run"
    
    payload := map[string]interface{}{
        "model_key": "model-key-here",
        "params": map[string]interface{}{
            "width":  1024,
            "height": 576,
            "generateParams": map[string]interface{}{
                "query": prompt,
            },
        },
    }

    jsonData, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST", genURL, bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer "+token)

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var runResult struct {
        ID string \`json:"id"\`
    }
    json.NewDecoder(resp.Body).Decode(&runResult)

    // 3. Polling результата
    for i := 0; i < 30; i++ {
        time.Sleep(2 * time.Second)
        
        statusURL := fmt.Sprintf(
            "https:// Kandinsky-api.sber.ru/api/v1/text2image/status/%s",
            runResult.ID,
        )
        statusReq, _ := http.NewRequest("GET", statusURL, nil)
        statusReq.Header.Set("Authorization", "Bearer "+token)
        
        statusResp, err := http.DefaultClient.Do(statusReq)
        if err != nil {
            continue
        }

        var statusResult struct {
            Status string   \`json:"status"\`
            Images []string \`json:"images"\`
        }
        json.NewDecoder(statusResp.Body).Decode(&statusResult)
        statusResp.Body.Close()

        if statusResult.Status == "DONE" && len(statusResult.Images) > 0 {
            return c.downloadImage(statusResult.Images[0])
        }
    }

    return "", fmt.Errorf("таймаут генерации Kandinsky")
}

func (c *KandinskyClient) downloadImage(base64Data string) (string, error) {
    filename := fmt.Sprintf("cover_%d.jpg", time.Now().Unix())
    fpath := filepath.Join(c.outputDir, filename)
    
    // base64Data - это base64 закодированное изображение
    // Нужно декодировать и сохранить
    // Упрощённая версия:
    err := os.WriteFile(fpath, []byte(base64Data), 0644)
    if err != nil {
        return "", err
    }
    
    return fpath, nil
}`
  },
  {
    name: 'image_huggingface.go',
    path: 'internal/ai/image_huggingface.go',
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

// HuggingFace Inference API - БЕСПЛАТНАЯ генерация картинок
// Регистрация: https://huggingface.co/settings/tokens
// Бесплатно: ограниченное количество запросов в день
// Модели: stabilityai/stable-diffusion-xl-base-1.0, runwayml/stable-diffusion-v1-5

type HFImageClient struct {
    apiKey    string
    model     string
    outputDir string
}

func NewHFImageClient(apiKey, model, outputDir string) *HFImageClient {
    os.MkdirAll(outputDir, 0755)
    return &HFImageClient{
        apiKey:    apiKey,
        model:     model,
        outputDir: outputDir,
    }
}

func (c *HFImageClient) Generate(prompt string) (string, error) {
    url := fmt.Sprintf(
        "https://api-inference.huggingface.co/models/%s",
        c.model,
    )

    payload := map[string]string{
        "inputs": prompt,
    }
    jsonData, _ := json.Marshal(payload)

    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer "+c.apiKey)

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", fmt.Errorf("ошибка HF API: %w", err)
    }
    defer resp.Body.Close()

    // Проверяем что ответ - это изображение
    contentType := resp.Header.Get("Content-Type")
    if contentType == "application/json" {
        body, _ := io.ReadAll(resp.Body)
        return "", fmt.Errorf("HF API ошибка: %s", body)
    }

    // Сохраняем изображение
    filename := fmt.Sprintf("cover_%d.png", time.Now().Unix())
    fpath := filepath.Join(c.outputDir, filename)

    file, err := os.Create(fpath)
    if err != nil {
        return "", err
    }
    defer file.Close()

    _, err = io.Copy(file, resp.Body)
    if err != nil {
        return "", err
    }

    return fpath, nil
}`
  },
  {
    name: 'text_provider.go',
    path: 'internal/ai/text_provider.go',
    code: `package ai

import "fmt"

// TextProvider - единый интерфейс для всех провайдеров текста
type TextProvider interface {
    GenerateArticle(topic, title string, keywords []string) (string, error)
    GenerateImagePrompt(title, topic string) (string, error)
    GenerateContentIdeas(topics []string, count int) (string, error)
}

// ImageProvider - единый интерфейс для всех провайдеров картинок
type ImageProvider interface {
    Generate(prompt string) (string, error)
}

// NewTextProvider создаёт провайдер текста по конфигу
func NewTextProvider(provider string, cfg interface{}) (TextProvider, error) {
    switch provider {
    case "ollama":
        c := cfg.(OllamaConfig)
        return NewOllamaClient(c.URL, c.Model), nil
    case "groq":
        c := cfg.(GroqConfig)
        return NewGroqClient(c.APIKey, c.Model), nil
    case "gemini":
        c := cfg.(GeminiConfig)
        return NewGeminiClient(c.APIKey, c.Model), nil
    default:
        return nil, fmt.Errorf("неизвестный провайдер текста: %s", provider)
    }
}

// NewImageProvider создаёт провайдер картинок по конфигу
func NewImageProvider(provider string, cfg interface{}) (ImageProvider, error) {
    switch provider {
    case "pollinations":
        outputDir := cfg.(string)
        return NewPollinationsClient(outputDir), nil
    case "kandinsky":
        c := cfg.(KandinskyConfig)
        return NewKandinskyClient(c.AuthKey, c.Scope, "./data/images"), nil
    case "huggingface":
        c := cfg.(HFImageConfig)
        return NewHFImageClient(c.APIKey, c.Model, "./data/images"), nil
    default:
        return nil, fmt.Errorf("неизвестный провайдер картинок: %s", provider)
    }
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
    cfg         *config.Config
    db          *storage.Storage
    cron        *cron.Cron
    textProvider ai.TextProvider
    imgProvider  ai.ImageProvider
    dzenAPI     *dzen.Client
}

func New(cfg *config.Config, db *storage.Storage) *Scheduler {
    loc, _ := time.LoadLocation(cfg.Schedule.Timezone)
    c := cron.New(cron.WithLocation(loc))

    // Создаём провайдеры (бесплатные!)
    var textProvider ai.TextProvider
    var err error

    switch cfg.Text.Provider {
    case "ollama":
        textProvider = ai.NewOllamaClient(cfg.Text.Ollama.URL, cfg.Text.Ollama.Model)
    case "groq":
        textProvider = ai.NewGroqClient(cfg.Text.Groq.APIKey, cfg.Text.Groq.Model)
    case "gemini":
        textProvider = ai.NewGeminiClient(cfg.Text.Gemini.APIKey, cfg.Text.Gemini.Model)
    default:
        log.Fatalf("Неизвестный провайдер текста: %s", cfg.Text.Provider)
    }

    var imgProvider ai.ImageProvider
    switch cfg.Image.Provider {
    case "pollinations":
        imgProvider = ai.NewPollinationsClient(cfg.Image.OutputDir)
    case "kandinsky":
        imgProvider = ai.NewKandinskyClient(
            cfg.Image.Kandinsky.AuthKey,
            cfg.Image.Kandinsky.Scope,
            cfg.Image.OutputDir,
        )
    case "huggingface":
        imgProvider = ai.NewHFImageClient(
            cfg.Image.HuggingFace.APIKey,
            cfg.Image.HuggingFace.Model,
            cfg.Image.OutputDir,
        )
    default:
        log.Fatalf("Неизвестный провайдер картинок: %s", cfg.Image.Provider)
    }

    _ = err

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
    for _, job := range s.cfg.Schedule.Articles {
        s.cron.AddFunc(job.Cron, func() { s.generateAndPublish("article") })
    }
    for _, job := range s.cfg.Schedule.Posts {
        s.cron.AddFunc(job.Cron, func() { s.generateAndPublish("post") })
    }
    s.cron.Start()
    log.Printf("Планировщик запущен (текст: %s, картинки: %s)",
        s.cfg.Text.Provider, s.cfg.Image.Provider)
}

func (s *Scheduler) Stop() { s.cron.Stop() }

func (s *Scheduler) generateAndPublish(contentType string) {
    log.Printf("Генерация %s...", contentType)

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
        ideas, _ := s.textProvider.GenerateContentIdeas(s.cfg.Content.DefaultTopics, 1)
        title = ideas
        topic = s.cfg.Content.DefaultTopics[0]
    }

    // Генерация текста (бесплатно!)
    content, err := s.textProvider.GenerateArticle(topic, title, keywords)
    if err != nil {
        log.Printf("Ошибка текста: %v", err)
        s.db.AddLog("text_generation", title, "error")
        return
    }
    s.db.AddLog("text_generation", title, "success")

    // Генерация картинки (бесплатно!)
    imagePrompt, _ := s.textProvider.GenerateImagePrompt(title, topic)
    imagePath, err := s.imgProvider.Generate(imagePrompt)
    if err != nil {
        log.Printf("Ошибка картинки: %v", err)
    } else {
        s.db.AddLog("image_generation", title, "success")
    }

    // Сохранение
    article := models.Article{
        Title: title, Content: content,
        ImagePath: imagePath, ImagePrompt: imagePrompt, Status: "ready",
    }
    s.db.SaveArticle(article)

    // Публикация в Дзен
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
        <h1 className="text-3xl font-bold">Go Код (Бесплатные модели)</h1>
        <p className="text-gray-400 mt-1">Полный код с поддержкой бесплатных AI: Ollama, Groq, Gemini, Pollinations, Kandinsky</p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-green-400 text-sm font-medium">Стоимость: $0.00/мес</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
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
