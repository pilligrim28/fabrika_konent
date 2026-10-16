FROM golang:1.21-alpine AS builder

WORKDIR /app

# Установка зависимостей для CGO (SQLite)
RUN apk add --no-cache gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -o content-factory ./cmd/main.go

# Финальный образ
FROM alpine:latest

RUN apk --no-cache add ca-certificates sqlite-libs

WORKDIR /app

COPY --from=builder /app/content-factory .
COPY --from=builder /app/configs ./configs

RUN mkdir -p /app/data/images

# Порт для будущего веб-интерфейса
EXPOSE 8080

CMD ["./content-factory"]
