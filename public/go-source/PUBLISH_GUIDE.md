# 📤 Инструкция по публикации на GitHub

## 🚀 Быстрая публикация (рекомендуется)

### 1. Установите GitHub CLI

**macOS:**
```bash
brew install gh
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt update && sudo apt install gh

# Fedora/RHEL
sudo dnf install gh

# Arch
sudo pacman -S github-cli
```

**Windows:**
```bash
winget install --id GitHub.cli
```

### 2. Авторизуйтесь

```bash
gh auth login
```

Следуйте инструкциям:
- Выберите **GitHub.com**
- Выберите **HTTPS**
- Выберите **Login with a web browser**
- Скопируйте код и откройте URL в браузере

### 3. Опубликуйте проект

**Вариант A: Автоматическая публикация**
```bash
chmod +x publish.sh
./publish.sh
```

**Вариант B: Ручная публикация**
```bash
# Создайте репозиторий на https://github.com/new
# Имя: content-factory
# Описание: Автоматическая контент-фабрика на Go с бесплатными AI

# Инициализируйте git
git init
git add .
git commit -m "Initial commit: контент-фабрика на Go"

# Добавьте remote и отправьте
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/content-factory.git
git push -u origin main
```

## 🔧 Настройка CI/CD

Проект включает GitHub Actions workflow (`.github/workflows/ci.yml`), который автоматически:
- Собирает проект при каждом push
- Запускает тесты
- Опционально публикует Docker образ

### Для Docker публикации:

1. Перейдите в **Settings → Secrets → Actions**
2. Добавьте следующие secrets:
   - `DOCKER_USERNAME`: ваш Docker Hub username
   - `DOCKER_PASSWORD`: ваш Docker Hub password/token

## 📝 Добавление тем

Для лучшего поиска добавьте темы:

```bash
gh repo edit --add-topic go --add-topic telegram-bot --add-topic yandex-dzen --add-topic ai --add-topic automation
```

Или вручную: **Settings → About → Topics**

## ✅ Готово!

Ваш проект опубликован на GitHub!

### Что дальше:

- 📥 Принимайте pull requests от других разработчиков
- 🌿 Создавайте ветки для новых функций
- 🐛 Используйте GitHub Issues для отслеживания задач
- 📊 Отслеживайте статистику в **Insights**
- 🤝 Добавьте соавторов в **Settings → Collaborators**

## 📚 Дополнительные ресурсы

- [Создание репозитория](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Управление файлами](https://docs.github.com/en/repositories/working-with-files/managing-files)
- [Ветки и слияния](https://docs.github.com/en/repositories/configuring-branches-and-merges)

## 💡 Советы

1. **Описание репозитория**: Добавьте подробное описание в **Settings → About**
2. **README**: Убедитесь, что README.md содержит всю необходимую информацию
3. **Лицензия**: Проект использует MIT лицензию (файл LICENSE)
4. **Issues**: Включите GitHub Issues для отслеживания багов и feature requests
5. **Wiki**: Создайте wiki для дополнительной документации

---

💰 **Стоимость проекта: $0.00/мес** (бесплатные AI модели)

🎉 **Удачи с вашим проектом!**
