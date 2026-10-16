package ai

import "fmt"

// TextProvider - интерфейс для всех провайдеров текста
type TextProvider interface {
	GenerateArticle(topic, title string, keywords []string) (string, error)
	GenerateImagePrompt(title, topic string) (string, error)
	GenerateContentIdeas(topics []string, count int) (string, error)
}

// ImageProvider - интерфейс для всех провайдеров картинок
type ImageProvider interface {
	Generate(prompt string) (string, error)
}

// NewTextProvider создаёт провайдер текста по конфигу
func NewTextProvider(provider string, cfg interface{}) (TextProvider, error) {
	switch provider {
	case "ollama":
		c, ok := cfg.(OllamaConfig)
		if !ok {
			return nil, fmt.Errorf("неверная конфигурация Ollama")
		}
		return NewOllamaClient(c.URL, c.Model), nil
	case "groq":
		c, ok := cfg.(GroqConfig)
		if !ok {
			return nil, fmt.Errorf("неверная конфигурация Groq")
		}
		return NewGroqClient(c.APIKey, c.Model), nil
	case "gemini":
		c, ok := cfg.(GeminiConfig)
		if !ok {
			return nil, fmt.Errorf("неверная конфигурация Gemini")
		}
		return NewGeminiClient(c.APIKey, c.Model), nil
	case "huggingface":
		c, ok := cfg.(HFTextConfig)
		if !ok {
			return nil, fmt.Errorf("неверная конфигурация HuggingFace")
		}
		return NewHFTextClient(c.APIKey, c.Model), nil
	default:
		return nil, fmt.Errorf("неизвестный провайдер текста: %s", provider)
	}
}

// NewImageProvider создаёт провайдер картинок по конфигу
func NewImageProvider(provider string, cfg interface{}, outputDir string) (ImageProvider, error) {
	switch provider {
	case "pollinations":
		return NewPollinationsClient(outputDir), nil
	case "kandinsky":
		c, ok := cfg.(KandinskyConfig)
		if !ok {
			return nil, fmt.Errorf("неверная конфигурация Kandinsky")
		}
		return NewKandinskyClient(c.AuthKey, c.Scope, outputDir), nil
	case "huggingface":
		c, ok := cfg.(HFImageConfig)
		if !ok {
			return nil, fmt.Errorf("неверная конфигурация HF Image")
		}
		return NewHFImageClient(c.APIKey, c.Model, outputDir), nil
	default:
		return nil, fmt.Errorf("неизвестный провайдер картинок: %s", provider)
	}
}

// Вспомогательные типы для передачи конфигурации
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

type HFTextConfig struct {
	APIKey string
	Model  string
}

type KandinskyConfig struct {
	AuthKey string
	Scope   string
}

type HFImageConfig struct {
	APIKey string
	Model  string
}
