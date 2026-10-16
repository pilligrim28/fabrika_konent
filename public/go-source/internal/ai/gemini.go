package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// GeminiClient - БЕСПЛАТНЫЙ API от Google
// Регистрация: https://aistudio.google.com/app/apikey
// Бесплатно: 15 запросов/мин (Gemini 1.5 Flash)
// Модели: gemini-1.5-flash, gemini-1.5-pro

type GeminiClient struct {
	apiKey string
	model  string
	client *http.Client
}

func NewGeminiClient(apiKey, model string) *GeminiClient {
	return &GeminiClient{
		apiKey: apiKey,
		model:  model,
		client: &http.Client{Timeout: 60 * time.Second},
	}
}

type GeminiPart struct {
	Text string `json:"text"`
}

type GeminiContent struct {
	Parts []GeminiPart `json:"parts"`
	Role  string       `json:"role,omitempty"`
}

type GeminiRequest struct {
	Contents         []GeminiContent `json:"contents"`
	SystemInstruction *GeminiContent `json:"system_instruction,omitempty"`
	GenerationConfig struct {
		MaxOutputTokens int     `json:"maxOutputTokens"`
		Temperature     float64 `json:"temperature"`
	} `json:"generationConfig"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []GeminiPart `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

func (c *GeminiClient) Generate(system, prompt string) (string, error) {
	url := fmt.Sprintf(
		"https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
		c.model, c.apiKey,
	)

	reqBody := GeminiRequest{
		Contents: []GeminiContent{
			{
				Parts: []GeminiPart{{Text: prompt}},
				Role:  "user",
			},
		},
	}

	if system != "" {
		reqBody.SystemInstruction = &GeminiContent{
			Parts: []GeminiPart{{Text: system}},
			Role:  "system",
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
	system := `Ты — опытный копирайтер для Яндекс Дзен. Пиши интересные, полезные статьи на русском языке.
Требования: живой стиль, подзаголовки, списки, примеры, практические советы, цепляющее вступление, вывод в конце. Объём 1000-1500 слов.`

	prompt := fmt.Sprintf(
		"Напиши статью для Яндекс Дзен.\n\nТема: %s\nЗаголовок: %s\nКлючевые слова: %v\n\nСтатья:",
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
		"Предложи %d тем для Яндекс Дзен. Области: %v. JSON: [{\"title\":\"...\",\"keywords\":[\"...\"]}] ТОЛЬКО JSON.",
		count, topics,
	)
	return c.Generate(system, prompt)
}
