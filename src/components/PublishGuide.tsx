import { useState } from 'react';
import { Github, ExternalLink, Copy, Check, Terminal, BookOpen, GitBranch, GitCommit, GitPullRequest } from 'lucide-react';

export default function PublishGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const ghInstallCommands = {
    macos: 'brew install gh',
    linux: `# Debian/Ubuntu
sudo apt update && sudo apt install gh

# Fedora/RHEL
sudo dnf install gh

# Arch
sudo pacman -S github-cli`,
    windows: `# winget
winget install --id GitHub.cli

# Или скачайте с https://cli.github.com/`
  };

  const publishScript = `#!/bin/bash

# Установите GitHub CLI (если не установлен)
# macOS: brew install gh
# Linux: https://cli.github.com/manual/installation

# Авторизуйтесь в GitHub
gh auth login

# Создайте репозиторий и опубликуйте
gh repo create content-factory --public --source=. --remote=origin --push

# Или создайте приватный репозиторий
# gh repo create content-factory --private --source=. --remote=origin --push`;

  const manualPublish = `# 1. Инициализируйте git
git init
git add .
git commit -m "Initial commit: контент-фабрика на Go"

# 2. Создайте репозиторий на https://github.com/new
# Имя: content-factory
# Описание: Автоматическая контент-фабрика на Go с бесплатными AI
# Видимость: Public или Private

# 3. Добавьте remote и отправьте
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/content-factory.git
git push -u origin main`;

  const ciSetup = `# GitHub Actions автоматически:
# - Собирает проект при каждом push
# - Запускает тесты
# - Опционально публикует Docker образ

# Для Docker публикации добавьте secrets в GitHub:
# Settings → Secrets → Actions → New repository secret

# DOCKER_USERNAME: ваш Docker Hub username
# DOCKER_PASSWORD: ваш Docker Hub password/token`;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Github size={32} className="text-purple-400" />
          Публикация на GitHub
        </h1>
        <p className="text-gray-400 mt-2">
          Пошаговая инструкция по публикации проекта на GitHub
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <a
          href="https://github.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all"
        >
          <Github size={24} className="text-purple-400" />
          <div>
            <p className="font-bold text-white">Создать репозиторий</p>
            <p className="text-sm text-gray-400">github.com/new</p>
          </div>
        </a>
        <a
          href="https://cli.github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl transition-all"
        >
          <Terminal size={24} className="text-blue-400" />
          <div>
            <p className="font-bold text-white">GitHub CLI</p>
            <p className="text-sm text-gray-400">cli.github.com</p>
          </div>
        </a>
        <a
          href="https://docs.github.com/en/get-started"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl transition-all"
        >
          <BookOpen size={24} className="text-green-400" />
          <div>
            <p className="font-bold text-white">Документация</p>
            <p className="text-sm text-gray-400">docs.github.com</p>
          </div>
        </a>
      </div>

      {/* Step 1: Install GitHub CLI */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center font-bold">
            1
          </div>
          <h2 className="text-xl font-bold">Установите GitHub CLI</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-sm mb-2 text-gray-300">macOS:</h3>
            <div className="relative">
              <pre className="bg-gray-900 rounded-lg p-3 font-mono text-sm overflow-x-auto">
                <code className="text-green-400">{ghInstallCommands.macos}</code>
              </pre>
              <button
                onClick={() => handleCopy(ghInstallCommands.macos, 'gh-macos')}
                className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-all"
              >
                {copied === 'gh-macos' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-2 text-gray-300">Linux:</h3>
            <div className="relative">
              <pre className="bg-gray-900 rounded-lg p-3 font-mono text-sm overflow-x-auto">
                <code className="text-green-400 whitespace-pre">{ghInstallCommands.linux}</code>
              </pre>
              <button
                onClick={() => handleCopy(ghInstallCommands.linux, 'gh-linux')}
                className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-all"
              >
                {copied === 'gh-linux' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-2 text-gray-300">Windows:</h3>
            <div className="relative">
              <pre className="bg-gray-900 rounded-lg p-3 font-mono text-sm overflow-x-auto">
                <code className="text-green-400 whitespace-pre">{ghInstallCommands.windows}</code>
              </pre>
              <button
                onClick={() => handleCopy(ghInstallCommands.windows, 'gh-windows')}
                className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-all"
              >
                {copied === 'gh-windows' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Authentication */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-600/20 text-green-400 rounded-lg flex items-center justify-center font-bold">
            2
          </div>
          <h2 className="text-xl font-bold">Авторизуйтесь в GitHub</h2>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code className="text-green-400 whitespace-pre">{`# Запустите команду и следуйте инструкциям
gh auth login

# Выберите:
# - GitHub.com
# - HTTPS
# - Login with a web browser
# - Скопируйте код и откройте URL в браузере`}</code>
          </pre>
          <button
            onClick={() => handleCopy(`gh auth login`, 'auth')}
            className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-all"
          >
            {copied === 'auth' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Step 3: Publish */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-600/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
            3
          </div>
          <h2 className="text-xl font-bold">Опубликуйте проект</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-sm mb-2 text-gray-300 flex items-center gap-2">
              <GitBranch size={16} />
              Способ 1: Автоматическая публикация (рекомендуется)
            </h3>
            <div className="relative">
              <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code className="text-purple-400 whitespace-pre">{publishScript}</code>
              </pre>
              <button
                onClick={() => handleCopy(publishScript, 'publish-script')}
                className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-all"
              >
                {copied === 'publish-script' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-2 text-gray-300 flex items-center gap-2">
              <GitCommit size={16} />
              Способ 2: Ручная публикация
            </h3>
            <div className="relative">
              <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code className="text-blue-400 whitespace-pre">{manualPublish}</code>
              </pre>
              <button
                onClick={() => handleCopy(manualPublish, 'manual-publish')}
                className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-all"
              >
                {copied === 'manual-publish' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: CI/CD Setup */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-600/20 text-orange-400 rounded-lg flex items-center justify-center font-bold">
            4
          </div>
          <h2 className="text-xl font-bold">Настройте CI/CD (опционально)</h2>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code className="text-orange-400 whitespace-pre">{ciSetup}</code>
          </pre>
          <button
            onClick={() => handleCopy(ciSetup, 'ci-setup')}
            className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-all"
          >
            {copied === 'ci-setup' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-200">
            <strong>💡 Совет:</strong> GitHub Actions workflow уже включен в проект (файл <code className="bg-gray-900 px-2 py-0.5 rounded">.github/workflows/ci.yml</code>). 
            Он автоматически собирает проект при каждом push.
          </p>
        </div>
      </div>

      {/* Step 5: Add Topics */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-pink-600/20 text-pink-400 rounded-lg flex items-center justify-center font-bold">
            5
          </div>
          <h2 className="text-xl font-bold">Добавьте темы и описание</h2>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code className="text-pink-400 whitespace-pre">{`# Добавьте темы для лучшего поиска
gh repo edit --add-topic go --add-topic telegram-bot --add-topic yandex-dzen --add-topic ai --add-topic automation

# Или вручную: Settings → About → Topics`}</code>
          </pre>
          <button
            onClick={() => handleCopy(`gh repo edit --add-topic go --add-topic telegram-bot --add-topic yandex-dzen --add-topic ai --add-topic automation`, 'topics')}
            className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-all"
          >
            {copied === 'topics' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-600/20 text-green-400 rounded-lg flex items-center justify-center">
            <Check size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-400 mb-2">Готово!</h2>
            <p className="text-gray-300 mb-4">
              Ваш проект успешно опубликован на GitHub. Теперь вы можете:
            </p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <GitPullRequest size={16} className="text-purple-400" />
                Принимать pull requests от других разработчиков
              </li>
              <li className="flex items-center gap-2">
                <GitBranch size={16} className="text-blue-400" />
                Создавать ветки для новых функций
              </li>
              <li className="flex items-center gap-2">
                <Github size={16} className="text-green-400" />
                Использовать GitHub Issues для отслеживания задач
              </li>
              <li className="flex items-center gap-2">
                <BookOpen size={16} className="text-orange-400" />
                Делиться проектом с сообществом
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Дополнительные ресурсы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://docs.github.com/en/get-started/quickstart/create-a-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all"
          >
            <ExternalLink size={16} className="text-blue-400" />
            <div>
              <p className="text-sm font-medium">Создание репозитория</p>
              <p className="text-xs text-gray-500">docs.github.com</p>
            </div>
          </a>
          <a
            href="https://docs.github.com/en/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all"
          >
            <ExternalLink size={16} className="text-blue-400" />
            <div>
              <p className="text-sm font-medium">GitHub Actions</p>
              <p className="text-xs text-gray-500">Автоматизация CI/CD</p>
            </div>
          </a>
          <a
            href="https://docs.github.com/en/repositories/working-with-files/managing-files"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all"
          >
            <ExternalLink size={16} className="text-blue-400" />
            <div>
              <p className="text-sm font-medium">Управление файлами</p>
              <p className="text-xs text-gray-500">Работа с файлами в Git</p>
            </div>
          </a>
          <a
            href="https://docs.github.com/en/repositories/configuring-branches-and-merges"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all"
          >
            <ExternalLink size={16} className="text-blue-400" />
            <div>
              <p className="text-sm font-medium">Ветки и слияния</p>
              <p className="text-xs text-gray-500">Git branching strategy</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
