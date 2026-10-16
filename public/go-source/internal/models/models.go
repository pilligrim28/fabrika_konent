package models

import "time"

type ContentPlanItem struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Topic       string    `json:"topic"`
	ContentType string    `json:"content_type"` // article, post, video-script
	ScheduledAt time.Time `json:"scheduled_at"`
	Status      string    `json:"status"` // planned, generating, ready, published
	Keywords    string    `json:"keywords"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Article struct {
	ID          int64     `json:"id"`
	PlanID      int64     `json:"plan_id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	ImagePath   string    `json:"image_path"`
	ImagePrompt string    `json:"image_prompt"`
	DzenURL     string    `json:"dzen_url"`
	DzenID      string    `json:"dzen_id"`
	Status      string    `json:"status"` // draft, ready, published, error
	CreatedAt   time.Time `json:"created_at"`
	PublishedAt time.Time `json:"published_at"`
}

type LogEntry struct {
	ID        int64     `json:"id"`
	Action    string    `json:"action"`
	Detail    string    `json:"detail"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}

type GenerationResult struct {
	Success    bool    `json:"success"`
	Title      string  `json:"title"`
	Content    string  `json:"content"`
	ImagePath  string  `json:"image_path"`
	Error      string  `json:"error,omitempty"`
	TokensUsed int     `json:"tokens_used"`
	CostUSD    float64 `json:"cost_usd"`
}
