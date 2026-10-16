# 🤖 Контент-Фабрика — Полный проект для скачивания

## 📦 Что включено

Полный Go проект для автоматической генерации и публикации контента в Яндекс Дзен с использованием **бесплатных AI моделей**.

### Структура проекта (22 файла):

```
content-factory/
├── README.md                          # Документация
├── go.mod                             # Go модули
├── go.sum                             # Зависимости
├── Dockerfile                         # Docker образ
├── docker-compose.yml                 # Docker Compose
├── .gitignore                         # Git ignore
│
├── configs/
│   └── config.yaml                    # Конфигурация
│
├── cmd/
│   └── main.go                        # Точка входа
│
└── internal/
    ├── ai/
    │   ├── provider.go                # Интерфейсы AI провайдеров
    │   ├── ollama.go                  # Ollama (бесплатно, локально)
    │   ├── groq.go                    # Groq (бесплатно, облако)
    │   ├── gemini.go                  # Google Gemini (бесплатно)
    │   ├── huggingface_text.go        # HuggingFace текст
    │   ├── image_pollinations.go      # Pollinations (без ключа!)
    │   ├── image_kandinsky.go         # Kandinsky (Сбер)
    │   └── image_huggingface.go       # HF Stable Diffusion
    │
    ├── bot/
    │   └── bot.go                     # Telegram бот с поддержкой прокси
    │
    ├── config/
    │   └── config.go                  # Загрузка конфигурации
    │
    ├── dzen/
    │   └── dzen.go                    # Яндекс Дзен API
    │
    ├── models/
    │   └── models.go                  # Модели данных
    │
    ├── scheduler/
    │   └── scheduler.go               # Cron планировщик
    │
    └── storage/
        └── storage.go                 # SQLite база данных
```

## 🚀 Как скачать

### Способ 1: Через веб-интерфейс (рекомендуется)

1. Откройте дашборд контент-фабрики
2. Перейдите на вкладку **"Скачать"**
3. Нажмите кнопку **"Скачать ZIP архив"**
4. Дождитесь создания архива (прогресс отображается)
5. Распакуйте `content-factory.zip`

### Способ 2: Скачивание отдельных файлов

На вкладке **"Скачать"** вы можете скачать каждый файл отдельно, нажав на иконку загрузки рядом с ним.

### Способ 3: Через Go Code

На вкладке **"Go Код"** можно:
- Просмотреть содержимое каждого файла
- Скопировать код в буфер обмена
- Скачать отдельный файл

## 📋 Быстрый старт

### 1. Установите Ollama (бесплатный AI для текста)

```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Загрузите модель
ollama pull llama3.1

# Запустите сервер
ollama serve
```

### 2. Распакуйте проект

```bash
unzip content-factory.zip
cd content-factory
```

### 3. Установите зависимости

```bash
go mod download
```

### 4. Настройте конфигурацию

```bash
cp configs/config.yaml.example configs/config.yaml
nano configs/config.yaml
```

Минимальная конфигурация:

```yaml
telegram:
  bot_token: "YOUR_BOT_TOKEN"
  admin_chat_id: 123456789

text:
  provider: "ollama"
  ollama:
    url: "http://localhost:11434"
    model: "llama3.1"

image:
  provider: "pollinations"
  output_dir: "./data/images"

dzen:
  oauth_token: "YOUR_YANDEX_OAUTH_TOKEN"
  channel_id: "YOUR_CHANNEL_ID"
```

### 5. Запустите проект

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

## 🔒 Прокси для Telegram

Если Telegram API заблокирован, используйте прокси:

### Публичные MTProto прокси:
- [@MTProxybot](https://t.me/MTProxybot) — официальный бот
- [@proxy_list](https://t.me/proxy_list) — список прокси
- [@MTProxyTOP](https://t.me/MTProxyTOP) — топ рабочих прокси

### Бесплатные SOCKS5 прокси:
- [sslproxies.org](https://www.sslproxies.org/)
- [free-proxy-list.net](https://free-proxy-list.net/)
- [GitHub PROXY-List](https://github.com/TheSpeedX/PROXY-List)

### Свой прокси на бесплатном VPS:
- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) — навсегда бесплатно
- [AWS Free Tier](https://aws.amazon.com/free/) — 12 месяцев
- [Google Cloud Free](https://cloud.google.com/free) — $300 кредитов

Пример конфигурации прокси:

```yaml
telegram:
  proxy:
    enabled: true
    type: "socks5"
    socks5:
      host: "your-proxy.com"
      port: 1080
      username: ""
      password: ""
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

## 💰 Стоимость

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
