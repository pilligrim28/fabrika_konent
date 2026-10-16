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
- 🔒 Поддержка прокси (MTProto / SOCKS5 / HTTP)

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

### 1. Скачайте проект

Нажмите кнопку **"Скачать ZIP"** в веб-интерфейсе или скачайте файлы вручную.

### 2. Установите Ollama (рекомендуется)

```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Загрузите модель
ollama pull llama3.1

# Запустите сервер
ollama serve
```

### 3. Распакуйте и перейдите в папку

```bash
unzip content-factory.zip
cd content-factory
```

### 4. Установите зависимости

```bash
go mod download
```

### 5. Настройте конфигурацию

Откройте `configs/config.yaml` и заполните:

```yaml
telegram:
  bot_token: "YOUR_BOT_TOKEN"  # от @BotFather
  admin_chat_id: 123456789      # от @userinfobot

text:
  provider: "ollama"
  ollama:
    url: "http://localhost:11434"
    model: "llama3.1"

image:
  provider: "pollinations"  # Без ключа!

dzen:
  oauth_token: "YOUR_YANDEX_TOKEN"
  channel_id: "YOUR_CHANNEL_ID"
```

### 6. Запустите

```bash
go run cmd/main.go
```

## 🐳 Docker запуск

```bash
# Сборка образа
docker build -t content-factory .

# Запуск
docker run -d --name content-factory \
  -v ./configs:/app/configs \
  -v .//app/data \
  --network host \
  content-factory

# Или через docker-compose
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

## 🔒 Настройка прокси

Если Telegram API заблокирован, настройте прокси в `configs/config.yaml`:

```yaml
telegram:
  proxy:
    enabled: true
    type: "socks5"
    socks5:
      host: "your-proxy.com"
      port: 1080
```

**Бесплатные прокси:**
- Публичные MTProto: @MTProxybot, @proxy_list
- SOCKS5: sslproxies.org, free-proxy-list.net
- Свой на Oracle Cloud Free Tier (навсегда бесплатно)
- Tor (порт 9050)

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
│   │   └── bot.go           # Telegram бот + прокси
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

### Прокси:
- MTProto: [@MTProxybot](https://t.me/MTProxybot), [@proxy_list](https://t.me/proxy_list)
- SOCKS5: [sslproxies.org](https://www.sslproxies.org/), [free-proxy-list.net](https://free-proxy-list.net/)
- VPS: [Oracle Cloud Free](https://www.oracle.com/cloud/free/), [AWS Free Tier](https://aws.amazon.com/free/)

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
- **JSZip** — создание ZIP архивов
- **Бесплатные AI** — Ollama, Groq, Gemini, Pollinations, Kandinsky

## 📝 Лицензия

MIT

---

💰 **Итого: полностью бесплатная контент-фабрика с AI!**

## 🎯 Что включено в ZIP

- ✅ 22 Go файла с полным кодом
- ✅ Конфигурация с примерами
- ✅ Docker файлы
- ✅ Документация
- ✅ Поддержка прокси
- ✅ Готово к запуску
