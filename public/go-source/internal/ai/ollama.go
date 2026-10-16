package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// OllamaClient - БЕСПЛАТНАЯ локальная генерация текста
// Установка: curl -fsSL https://ollama.com/install.sh | sh
// Модели: ollama pull llama3.1 / mistral / qwen2.5 / gemma2
// Документация: https://ollama.com

type OllamaClient struct {
	baseURL string
	model   string
	client  *http.Client
}

func NewOllamaClient(baseURL, model string) *OllamaClient {
	return &OllamaClient{
		baseURL: baseURL,
		model:   model,
		client:  &http.Client{Timeout: 120 * time.Second},
	}
}

type OllamaRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	System string `json:"system,omitempty"`
	Stream bool   `json:"stream"`
}

type OllamaResponse struct {
	Response string `json:"response"`
	Done     bool   `json:"done"`
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

	resp, err := c.client.Post(c.baseURL+"/api/generate", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("Ollama недоступна. Запустите: ollama serve. Ошибка: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("Ollama error %d: %s", resp.StatusCode, body)
	}

	var result OllamaResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("ошибка парсинга: %w", err)
	}

	return result.Response, nil
}

func (c *OllamaClient) GenerateArticle(topic, title string, keywords []string) (string, error) {
	system := `Ты — опытный копирайтер для Яндекс Дзен. Пиши интересные, полезные статьи на русском языке.
Требования к стилю:
- Живой, engaging язык
- Используй подзаголовки
- Добавляй списки и примеры
- Практические советы
- Цепляющее вступление
- Вывод в конце
- Объём: 1000-1500 слов`

	prompt := fmt.Sprintf(
		"Напиши статью для Яндекс Дзен.\n\n"+
			"Тема: %s\n"+
			"Заголовок: %s\n"+
			"Ключевые слова: %v\n\n"+
			"Статья:",
		topic, title, keywords,
	)

	return c.Generate(system, prompt)
}

func (c *OllamaClient) GenerateImagePrompt(title, topic string) (string, error) {
	system := "You create detailed image generation prompts. Return only the prompt in English, nothing else."

	prompt := fmt.Sprintf(
		"Create a detailed image generation prompt for an article cover.\n"+
			"Article title: %s\n"+
			"Topic: %s\n\n"+
			"Requirements: eye-catching, professional, bright modern style, no text.\n"+
			"Return ONLY the image prompt:",
		title, topic,
	)

	return c.Generate(system, prompt)
}

func (c *OllamaClient) GenerateContentIdeas(topics []string, count int) (string, error) {
	system := "Ты — контент-менеджер. Предлагаешь интересные темы для статей."

	prompt := fmt.Sprintf(
		"Предложи %d интересных тем для статей в Яндекс Дзен.\n"+
			"Области: %v\n\n"+
			"Для каждой темы укажи:\n"+
			"1. Заголовок (цепляющий, с цифрами или вопросом)\n"+
			"2. Краткое описание (1 предложение)\n"+
			"3. Ключевые слова (3-5 штук)\n\n"+
			"Формат JSON: [{\"title\":\"...\",\"description\":\"...\",\"keywords\":[\"...\"]}]\n"+
			"Верни ТОЛЬКО JSON:",
		count, topics,
	)

	return c.Generate(system, prompt)
}
