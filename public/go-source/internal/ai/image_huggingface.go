package ai

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

// HFImageClient - БЕСПЛАТНАЯ генерация картинок через HuggingFace
// Регистрация: https://huggingface.co/settings/tokens
// Модели: stabilityai/stable-diffusion-xl-base-1.0, runwayml/stable-diffusion-v1-5

type HFImageClient struct {
	apiKey    string
	model     string
	outputDir string
	client    *http.Client
}

func NewHFImageClient(apiKey, model, outputDir string) *HFImageClient {
	os.MkdirAll(outputDir, 0755)
	return &HFImageClient{
		apiKey:    apiKey,
		model:     model,
		outputDir: outputDir,
		client:    &http.Client{Timeout: 120 * time.Second},
	}
}

func (c *HFImageClient) Generate(prompt string) (string, error) {
	url := fmt.Sprintf("https://api-inference.huggingface.co/models/%s", c.model)

	payload := map[string]string{
		"inputs": prompt,
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
}
