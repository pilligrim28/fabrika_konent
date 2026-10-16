package ai

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"time"
)

// PollinationsClient - ПОЛНОСТЬЮ БЕСПЛАТНАЯ генерация картинок
// НЕ ТРЕБУЕТ API КЛЮЧА!
// Просто HTTP GET запрос с промптом
// Документация: https://pollinations.ai

type PollinationsClient struct {
	outputDir string
	client    *http.Client
}

func NewPollinationsClient(outputDir string) *PollinationsClient {
	os.MkdirAll(outputDir, 0755)
	return &PollinationsClient{
		outputDir: outputDir,
		client:    &http.Client{Timeout: 120 * time.Second},
	}
}

func (c *PollinationsClient) Generate(prompt string) (string, error) {
	// Формируем URL для Pollinations
	// Формат: https://image.pollinations.ai/prompt/{prompt}?width=1024&height=576&seed={random}
	encodedPrompt := url.PathEscape(prompt)
	seed := time.Now().UnixNano() % 100000

	imageURL := fmt.Sprintf(
		"https://image.pollinations.ai/prompt/%s?width=1024&height=576&seed=%d&nologo=true&model=flux",
		encodedPrompt, seed,
	)

	// Скачиваем изображение
	resp, err := c.client.Get(imageURL)
	if err != nil {
		return "", fmt.Errorf("ошибка запроса к Pollinations: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("Pollinations вернул статус %d", resp.StatusCode)
	}

	// Сохраняем файл
	filename := fmt.Sprintf("cover_%d.jpg", time.Now().Unix())
	fpath := filepath.Join(c.outputDir, filename)

	file, err := os.Create(fpath)
	if err != nil {
		return "", fmt.Errorf("ошибка создания файла: %w", err)
	}
	defer file.Close()

	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return "", fmt.Errorf("ошибка сохранения: %w", err)
	}

	return fpath, nil
}
