# 🤖 Контент-Фабрика

Автоматическая система для создания и публикации контента в Яндекс Дзен с использованием **бесплатных AI моделей**.

💰 **Стоимость: $0.00/мес**

## ✨ Возможности

- 📝 Автоматическая генерация статей (Ollama / Groq / Gemini / HuggingFace)
- 🎨 Генерация обложек (Pollinations.ai / Kandinsky / HuggingFace)
- 🚀 Публикация в Яндекс Дзен
- 📱 Управление через Telegram бота
- 📅 Контент-план с расписанием
- 📊 Статистика и логи

## 🆓 Бесплатные AI модели

### Текст (выберите один):
| Провайдер | Лимит | Ссылка |
|-----------|-------|--------|
| **Ollama** (локально) | ∞ безлимит | [ollama.com](https://ollama.com) |
| **Groq** | 14400 запросов/день | [console.groq.com](https://console.groq.com/keys) |
| **Google Gemini** | 1500 запросов/день | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| **HuggingFace** | бесплатный лимит | [huggingface.co](https://huggingface.co/settings/tokens) |

### Картинки (выберите один):
| Провайдер | Лимит | Ссылка |
|-----------|-------|--------|
| **Pollinations.ai** | ∞ без ключа! | [pollinations.ai](https://pollinations.ai) |
| **Kandinsky** (Сбер) | 1000 генераций/мес | [developers.sber.ru](https://developers.sber.ru/studio/workspaces) |
| **HuggingFace SD** | бесплатный лимит | [huggingface.co](https://huggingface.co/settings/tokens) |

## 🚀 Быстрый старт

### 1. Установите Ollama (рекомендуется)
```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Загрузите модель
ollama pull llama3.1

# Запустите сервер
ollama serve
```

### 2. Клонируйте проект
```bash
git clone https://github.com/yourname/content-factory
cd content-factory
```

### 3. Настройте конфигурацию
```bash
cp configs/config.yaml.example configs/config.yaml
nano configs/config.yaml
```

Заполните:
- `telegram.bot_token` — токен бота от [@BotFather](https://t.me/BotFather)
- `telegram.admin_chat_id` — ваш chat_id (узнать: [@userinfobot](https://t.me/userinfobot))
- `dzen.oauth_token` — OAuth токен Яндекс Дзен
- `dzen.channel_id` — ID вашего канала

### 4. Установите зависимости и запустите
```bash
go mod download
go run cmd/main.go
```

## 🐳 Docker запуск

```bash
docker build -t content-factory .
docker run -d --name cf \
  -v ./configs:/app/configs \
  -v ./data:/app/data \
  --network host \
  content-factory
```

Или через docker-compose:
```bash
docker-compose up -d
```

## 📱 Telegram команды

| Команда | Описание |
|---------|----------|
| `/start` | Приветствие |
| `/plan` | Контент-план на сегодня |
| `/plan week` | План на неделю |
| `/status` | Статус системы |
| `/add [тема]` | Добавить тему в план |
| `/generate [тема]` | Сгенерировать статью |
| `/stats` | Статистика |
| `/help` | Помощь |

## 📁 Структура проекта

```
content-factory/
├── cmd/
│   └── main.go              # Точка входа
├── internal/
│   ├── ai/
│   │   ├── provider.go      # Интерфейсы провайдеров
│   │   ├── ollama.go        # Ollama (бесплатно, локально)
│   │   ├── groq.go          # Groq (бесплатно, облако)
│   │   ├── gemini.go        # Google Gemini (бесплатно)
│   │   ├── huggingface_text.go  # HuggingFace текст
│   │   ├── image_pollinations.go # Pollinations (без ключа!)
│   │   ├── image_kandinsky.go    # Kandinsky (Сбер)
│   │   └── image_huggingface.go  # HF Stable Diffusion
│   ├── bot/
│   │   └── bot.go           # Telegram бот
│   ├── config/
│   │   └── config.go        # Конфигурация
│   ├── dzen/
│   │   └── dzen.go          # Яндекс Дзен API
│   ├── models/
│   │   └── models.go        # Модели данных
│   ├── scheduler/
│   │   └── scheduler.go     # Cron планировщик
│   └── storage/
│       └── storage.go       # SQLite база
├── configs/
│   └── config.yaml          # Конфиг
├── data/                    # Данные (БД, картинки)
├── go.mod
├── go.sum
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔗 Полезные ссылки

### Регистрация API ключей:
- 🤖 Telegram Bot: [@BotFather](https://t.me/BotFather)
- 🆔 Chat ID: [@userinfobot](https://t.me/userinfobot)
- 🧠 Groq: [console.groq.com/keys](https://console.groq.com/keys)
- 🧠 Gemini: [aistudio.google.com](https://aistudio.google.com/app/apikey)
- 🧠 HuggingFace: [huggingface.co/tokens](https://huggingface.co/settings/tokens)
- 🖼️ Pollinations: [pollinations.ai](https://pollinations.ai) (без ключа!)
- 🖼️ Kandinsky: [developers.sber.ru](https://developers.sber.ru/studio/workspaces)
- 📰 Яндекс Дзен: [dzen.ru](https://dzen.ru) → настройки → API

### Документация:
- Ollama: https://ollama.com
- Groq API: https://console.groq.com/docs
- Gemini API: https://ai.google.dev/docs
- Яндекс Дзен API: https://yandex.ru/dev/dzen/api/

## 💡 Рекомендации

### Минимальная конфигурация (без ключей):
```yaml
text:
  provider: "ollama"
  ollama:
    url: "http://localhost:11434"
    model: "llama3.1"

image:
  provider: "pollinations"
```

### Быстрая конфигурация (облако):
```yaml
text:
  provider: "groq"
  groq:
    api_key: "gsk_YOUR_KEY"
    model: "llama-3.1-8b-instant"

image:
  provider: "pollinations"
```

## 📊 Стоимость

| Конфигурация | Стоимость |
|--------------|-----------|
| Ollama + Pollinations | $0.00/мес |
| Groq + Pollinations | $0.00/мес |
| Gemini + Kandinsky | $0.00/мес |
| **Любая комбинация** | **$0.00/мес** |

## 🛠 Технологии

- **Go 1.21+** — основной язык
- **SQLite** — база данных
- **robfig/cron** — планировщик
- **go-telegram-bot-api** — Telegram бот
- **Бесплатные AI** — Ollama, Groq, Gemini, Pollinations, Kandinsky

## 📝 Лицензия

MIT

---

💰 **Итого: полностью бесплатная контент-фабрика с AI!**
