package dzen

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"content-factory/internal/config"
)

type Client struct {
	cfg    config.DzenConfig
	client *http.Client
}

func New(cfg config.DzenConfig) *Client {
	return &Client{
		cfg:    cfg,
		client: &http.Client{Timeout: 30 * time.Second},
	}
}

// Публикация статьи в Яндекс Дзен
func (c *Client) PublishArticle(title, content, imagePath string) (string, error) {
	// Сначала загружаем изображение
	var imageID string
	if imagePath != "" {
		var err error
		imageID, err = c.uploadImage(imagePath)
		if err != nil {
			return "", fmt.Errorf("ошибка загрузки картинки: %w", err)
		}
	}

	// Создаём статью
	article := map[string]interface{}{
		"content": map[string]interface{}{
			"blocks": []map[string]interface{}{
				{
					"type": "text",
					"data": map[string]interface{}{
						"content": content,
					},
				},
			},
		},
		"title":  title,
		"status": "published",
	}

	if imageID != "" {
		article["image"] = map[string]string{
			"id": imageID,
		}
	}

	jsonData, err := json.Marshal(article)
	if err != nil {
		return "", err
	}

	url := "https://api.dzen.ru/api/v1/publications"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "OAuth "+c.cfg.OAuthToken)

	resp, err := c.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("ошибка публикации: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("Дзен API ошибка %d: %s", resp.StatusCode, string(body))
	}

	var result struct {
		ID  string `json:"id"`
		URL string `json:"url"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	return result.URL, nil
}

// Загрузка изображения в Дзен
func (c *Client) uploadImage(imagePath string) (string, error) {
	file, err := os.Open(imagePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", filepath.Base(imagePath))
	if err != nil {
		return "", err
	}
	io.Copy(part, file)
	writer.Close()

	url := "https://api.dzen.ru/api/v1/uploads/image"
	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "OAuth "+c.cfg.OAuthToken)

	resp, err := c.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result struct {
		ID string `json:"id"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	return result.ID, nil
}

// Получение статистики канала
func (c *Client) GetChannelStats() (map[string]interface{}, error) {
	url := fmt.Sprintf("https://api.dzen.ru/api/v1/channels/%s/stats", c.cfg.ChannelID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "OAuth "+c.cfg.OAuthToken)

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var stats map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&stats)

	return stats, nil
}
