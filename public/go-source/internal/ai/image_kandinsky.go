package ai

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// KandinskyClient - БЕСПЛАТНАЯ генерация картинок от Сбера
// Регистрация: https://developers.sber.ru/studio/workspaces
// Бесплатно: 1000 генераций в месяц!

type KandinskyClient struct {
	authKey   string
	scope     string
	outputDir string
	client    *http.Client
}

func NewKandinskyClient(authKey, scope, outputDir string) *KandinskyClient {
	os.MkdirAll(outputDir, 0755)
	return &KandinskyClient{
		authKey:   authKey,
		scope:     scope,
		outputDir: outputDir,
		client:    &http.Client{Timeout: 120 * time.Second},
	}
}

func (c *KandinskyClient) getAuthToken() (string, error) {
	url := "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"

	payload := "scope=" + c.scope
	req, _ := http.NewRequest("POST", url, bytes.NewBufferString(payload))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("RqUID", fmt.Sprintf("req-%d", time.Now().Unix()))
	req.Header.Set("Authorization", "Basic "+c.authKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var result struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("ошибка парсинга токена: %s", body)
	}

	return result.AccessToken, nil
}

func (c *KandinskyClient) Generate(prompt string) (string, error) {
	// 1. Получаем токен
	token, err := c.getAuthToken()
	if err != nil {
		return "", fmt.Errorf("ошибка получения токена: %w", err)
	}

	// 2. Запускаем генерацию
	genURL := "https:// Kandinsky-api.sber.ru/api/v1/text2image/run"

	payload := map[string]interface{}{
		"model_key": "model-key-here",
		"params": map[string]interface{}{
			"width":  1024,
			"height": 576,
			"generateParams": map[string]interface{}{
				"query": prompt,
			},
		},
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", genURL, bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := c.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var runResult struct {
		ID string `json:"id"`
	}
	json.Unmarshal(body, &runResult)

	// 3. Polling результата
	for i := 0; i < 30; i++ {
		time.Sleep(2 * time.Second)

		statusURL := fmt.Sprintf("https:// Kandinsky-api.sber.ru/api/v1/text2image/status/%s", runResult.ID)
		statusReq, _ := http.NewRequest("GET", statusURL, nil)
		statusReq.Header.Set("Authorization", "Bearer "+token)

		statusResp, err := c.client.Do(statusReq)
		if err != nil {
			continue
		}

		statusBody, _ := io.ReadAll(statusResp.Body)
		statusResp.Body.Close()

		var statusResult struct {
			Status string   `json:"status"`
			Images []string `json:"images"`
		}
		json.Unmarshal(statusBody, &statusResult)

		if statusResult.Status == "DONE" && len(statusResult.Images) > 0 {
			return c.saveBase64Image(statusResult.Images[0])
		}
	}

	return "", fmt.Errorf("таймаут генерации Kandinsky")
}

func (c *KandinskyClient) saveBase64Image(base64Data string) (string, error) {
	filename := fmt.Sprintf("cover_%d.jpg", time.Now().Unix())
	fpath := filepath.Join(c.outputDir, filename)

	// Декодируем base64
	imageData, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return "", fmt.Errorf("ошибка декодирования base64: %w", err)
	}

	if err := os.WriteFile(fpath, imageData, 0644); err != nil {
		return "", err
	}

	return fpath, nil
}
