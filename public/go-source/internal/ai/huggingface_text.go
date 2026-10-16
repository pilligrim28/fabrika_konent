package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// HFTextClient - БЕСПЛАТНАЯ генерация текста через HuggingFace
// Регистрация: https://huggingface.co/settings/tokens
// Модели: mistralai/Mistral-7B-Instruct-v0.3, meta-llama/Llama-3.1-8B-Instruct

type HFTextClient struct {
	apiKey string
	model  string
	client *http.Client
}

func NewHFTextClient(apiKey, model string) *HFTextClient {
	return &HFTextClient{
		apiKey: apiKey,
		model:  model,
		client: &http.Client{Timeout: 60 * time.Second},
	}
}

func (c *HFTextClient) Generate(system, prompt string) (string, error) {
	url := fmt.Sprintf("https://api-inference.huggingface.co/models/%s", c.model)

	fullPrompt := system + "\n\n" + prompt
	payload := map[string]interface{}{
		"inputs": fullPrompt,
		"parameters": map[string]interface{}{
			"max_new_tokens": 2000,
			"temperature":    0.7,
		},
	}

	jsonData, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("ошибка HF API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("HF API error %d: %s", resp.StatusCode, body)
	}

	var result []struct {
		GeneratedText string `json:"generated_text"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	if len(result) == 0 {
		return "", fmt.Errorf("пустой ответ от HuggingFace")
	}

	return result[0].GeneratedText, nil
}

func (c *HFTextClient) GenerateArticle(topic, title string, keywords []string) (string, error) {
	system := `Ты — опытный копирайтер для Яндекс Дзен. Пиши интересные, полезные статьи на русском языке.
Требования: живой стиль, подзаголовки, списки, примеры, практические советы, цепляющее вступление, вывод в конце. Объём 1000-1500 слов.`

	prompt := fmt.Sprintf(
		"Напиши статью для Яндекс Дзен.\n\nТема: %s\nЗаголовок: %s\nКлючевые слова: %v\n\nСтатья:",
		topic, title, keywords,
	)

	return c.Generate(system, prompt)
}

func (c *HFTextClient) GenerateImagePrompt(title, topic string) (string, error) {
	system := "You create image generation prompts. Return only the prompt in English."
	prompt := fmt.Sprintf(
		"Create image prompt for: %s (%s). Eye-catching, professional, no text. ONLY the prompt:",
		title, topic,
	)
	return c.Generate(system, prompt)
}

func (c *HFTextClient) GenerateContentIdeas(topics []string, count int) (string, error) {
	system := "Ты — контент-менеджер."
	prompt := fmt.Sprintf(
		"Предложи %d тем для Яндекс Дзен. Области: %v. JSON: [{\"title\":\"...\",\"keywords\":[\"...\"]}] ТОЛЬКО JSON.",
		count, topics,
	)
	return c.Generate(system, prompt)
}
