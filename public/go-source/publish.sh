#!/bin/bash

# Скрипт для публикации проекта на GitHub
# Использование: ./publish.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Публикация контент-фабрики на GitHub${NC}"
echo ""

# Проверка наличия git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git не установлен. Установите git и попробуйте снова.${NC}"
    exit 1
fi

# Проверка наличия gh (GitHub CLI)
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) не установлен.${NC}"
    echo -e "${BLUE}📦 Установите GitHub CLI:${NC}"
    echo "  - macOS: brew install gh"
    echo "  - Linux: https://cli.github.com/manual/installation"
    echo "  - Windows: https://cli.github.com/manual/installation"
    echo ""
    read -p "Хотите продолжить без gh? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    USE_GH=false
else
    USE_GH=true
fi

# Проверка авторизации
if [ "$USE_GH" = true ]; then
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}⚠️  Вы не авторизованы в GitHub CLI${NC}"
        echo -e "${BLUE}🔐 Выполните авторизацию:${NC}"
        gh auth login
    fi
fi

# Запрос имени репозитория
echo ""
read -p "Введите имя репозитория [content-factory]: " REPO_NAME
REPO_NAME=${REPO_NAME:-content-factory}

# Запрос описания
read -p "Введите описание репозитория [Автоматическая контент-фабрика на Go с бесплатными AI]: " REPO_DESC
REPO_DESC=${REPO_DESC:-Автоматическая контент-фабрика на Go с бесплатными AI}

# Запрос видимости
echo ""
echo "Выберите видимость репозитория:"
echo "  1) Public (публичный)"
echo "  2) Private (приватный)"
read -p "Ваш выбор [1]: " VISIBILITY
VISIBILITY=${VISIBILITY:-1}

if [ "$VISIBILITY" = "2" ]; then
    VISIBILITY_FLAG="--private"
    VISIBILITY_TEXT="private"
else
    VISIBILITY_FLAG="--public"
    VISIBILITY_TEXT="public"
fi

echo ""
echo -e "${BLUE}📋 Параметры публикации:${NC}"
echo "  Имя: $REPO_NAME"
echo "  Описание: $REPO_DESC"
echo "  Видимость: $VISIBILITY_TEXT"
echo ""

read -p "Продолжить? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Публикация отменена${NC}"
    exit 0
fi

# Инициализация git репозитория (если нужно)
if [ ! -d .git ]; then
    echo -e "${BLUE}📦 Инициализация git репозитория...${NC}"
    git init
    git add .
    git commit -m "Initial commit: контент-фабрика на Go"
fi

# Создание репозитория на GitHub
if [ "$USE_GH" = true ]; then
    echo -e "${BLUE}🔨 Создание репозитория на GitHub...${NC}"
    gh repo create "$REPO_NAME" $VISIBILITY_FLAG --description "$REPO_DESC" --source=. --push
    
    REPO_URL=$(gh repo view --json url -q .url)
else
    echo -e "${YELLOW}⚠️  GitHub CLI не используется. Создайте репозиторий вручную:${NC}"
    echo "  1. Перейдите на https://github.com/new"
    echo "  2. Создайте репозиторий с именем: $REPO_NAME"
    echo "  3. Выполните команды:"
    echo ""
    echo "     git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "     git branch -M main"
    echo "     git push -u origin main"
    echo ""
    exit 0
fi

echo ""
echo -e "${GREEN}✅ Проект успешно опубликован!${NC}"
echo ""
echo -e "${BLUE}🔗 URL репозитория:${NC} $REPO_URL"
echo ""
echo -e "${BLUE}📝 Следующие шаги:${NC}"
echo "  1. Откройте $REPO_URL"
echo "  2. Настройте GitHub Secrets для CI/CD:"
echo "     - DOCKER_USERNAME (опционально, для Docker Hub)"
echo "     - DOCKER_PASSWORD (опционально, для Docker Hub)"
echo "  3. Добавьте тему в репозиторий:"
echo "     gh repo edit --add-topic go --add-topic telegram-bot --add-topic yandex-dzen"
echo ""
echo -e "${GREEN}🎉 Готово!${NC}"
