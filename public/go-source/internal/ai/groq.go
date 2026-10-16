package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// GroqClient - БЕСПЛАТНЫЙ облачный API с очень быстрыми моделями
// Регистрация: https://console.groq.com
// Бесплатно: 30 запросов/мин, 14400 запросов/день
// Модели: llama-3.1-8b-instant, llama-3.1-70b-versatile, mixtral-8x7b-32768

type GroqClient struct {
	apiKey string
	model  string
	client *http.Client
}

func NewGroqClient(apiKey, model string) *GroqClient {
	return &GroqClient{
		apiKey: apiKey,
		model:  model,
		client: &http.Client{Timeout: 60 * time.Second},
	}
}

type GroqMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GroqRequest struct {
	Model       string        `json:"model"`
	Messages    []GroqMessage `json:"messages"`
	MaxTokens   int           `json:"max_tokens"`
	Temperature float64       `json:"temperature"`
}

type GroqResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
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

	resp, err := c.client.Do(req)
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
	system := `Ты — опытный копирайтер для Яндекс Дзен. Пиши интересные, полезные статьи на русском языке.
Требования: живой стиль, подзаголовки, списки, примеры, практические советы, цепляющее вступление, вывод в конце. Объём 1000-1500 слов.`

	prompt := fmt.Sprintf(
		"Напиши статью для Яндекс Дзен.\n\nТема: %s\nЗаголовок: %s\nКлючевые слова: %v\n\nСтатья:",
		topic, title, keywords,
	)

	return c.Generate(system, prompt)
}

func (c *GroqClient) GenerateImagePrompt(title, topic string) (string, error) {
	system := "You create image generation prompts. Return only the prompt in English."
	prompt := fmt.Sprintf(
		"Create image prompt for article cover. Title: %s, Topic: %s. Eye-catching, professional, bright, no text. ONLY the prompt:",
		title, topic,
	)
	return c.Generate(system, prompt)
}

func (c *GroqClient) GenerateContentIdeas(topics []string, count int) (string, error) {
	system := "Ты — контент-менеджер."
	prompt := fmt.Sprintf(
		"Предложи %d тем для Яндекс Дзен. Области: %v. JSON: [{\"title\":\"...\",\"keywords\":[\"...\"]}] ТОЛЬКО JSON.",
		count, topics,
	)
	return c.Generate(system, prompt)
}
