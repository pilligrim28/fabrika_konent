package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Telegram TelegramConfig `yaml:"telegram"`
	Text     TextConfig     `yaml:"text"`
	Image    ImageConfig    `yaml:"image"`
	Dzen     DzenConfig     `yaml:"dzen"`
	Schedule ScheduleConfig `yaml:"schedule"`
	Database DatabaseConfig `yaml:"database"`
	Content  ContentConfig  `yaml:"content"`
	Proxy    ProxyConfig    `yaml:"proxy"`
}

type ProxyConfig struct {
	Enabled bool   `yaml:"enabled"`
	URL     string `yaml:"url"`
}

type TelegramConfig struct {
	BotToken    string `yaml:"bot_token"`
	AdminChatID int64  `yaml:"admin_chat_id"`
}

type TextConfig struct {
	Provider    string         `yaml:"provider"`
	Ollama      OllamaConfig   `yaml:"ollama"`
	Groq        GroqConfig     `yaml:"groq"`
	Gemini      GeminiConfig   `yaml:"gemini"`
	HuggingFace HFTextConfig   `yaml:"huggingface"`
	MaxTokens   int            `yaml:"max_tokens"`
	Temperature float64        `yaml:"temperature"`
}

type OllamaConfig struct {
	URL   string `yaml:"url"`
	Model string `yaml:"model"`
}

type GroqConfig struct {
	APIKey string `yaml:"api_key"`
	Model  string `yaml:"model"`
}

type GeminiConfig struct {
	APIKey string `yaml:"api_key"`
	Model  string `yaml:"model"`
}

type HFTextConfig struct {
	APIKey string `yaml:"api_key"`
	Model  string `yaml:"model"`
}

type ImageConfig struct {
	Provider    string          `yaml:"provider"`
	Kandinsky   KandinskyConfig `yaml:"kandinsky"`
	HuggingFace HFImageConfig   `yaml:"huggingface"`
	OutputDir   string          `yaml:"output_dir"`
}

type KandinskyConfig struct {
	AuthKey string `yaml:"auth_key"`
	Scope   string `yaml:"scope"`
}

type HFImageConfig struct {
	APIKey string `yaml:"api_key"`
	Model  string `yaml:"model"`
}

type DzenConfig struct {
	OAuthToken string `yaml:"oauth_token"`
	ChannelID  string `yaml:"channel_id"`
}

type ScheduleConfig struct {
	Timezone string    `yaml:"timezone"`
	Articles []CronJob `yaml:"articles"`
	Posts    []CronJob `yaml:"posts"`
}

type CronJob struct {
	Cron string `yaml:"cron"`
}

type DatabaseConfig struct {
	Driver string `yaml:"driver"`
	DSN    string `yaml:"dsn"`
}

type ContentConfig struct {
	DefaultTopics   []string `yaml:"default_topics"`
	ArticlesPerDay  int      `yaml:"articles_per_day"`
	WordsPerArticle int      `yaml:"words_per_article"`
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

	// Подстановка из переменных окружения
	if v := os.Getenv("TELEGRAM_BOT_TOKEN"); v != "" {
		cfg.Telegram.BotToken = v
	}
	if v := os.Getenv("OPENAI_API_KEY"); v != "" {
		cfg.Text.Groq.APIKey = v
	}

	return &cfg, nil
}
