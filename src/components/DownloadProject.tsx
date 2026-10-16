import { useState } from 'react';
import { Download, FileCode, FolderOpen, Copy, Check, Terminal, ExternalLink, Package, Github, BookOpen } from 'lucide-react';
import { downloadProject, downloadFile, PROJECT_FILES, DownloadProgress } from '../utils/downloadProject';

export default function DownloadProject() {
  const [copied, setCopied] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadAll = async () => {
    setDownloading(true);
    setProgress({
      current: 0,
      total: PROJECT_FILES.length,
      currentFile: 'Начало...',
      status: 'downloading'
    });

    try {
      await downloadProject((p) => {
        setProgress(p);
      });
    } catch (error) {
      console.error('Ошибка скачивания:', error);
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setProgress(null);
      }, 2000);
    }
  };

  const handleDownloadFile = async (path: string, url: string) => {
    try {
      await downloadFile(path, url);
    } catch (error) {
      console.error('Ошибка скачивания файла:', error);
    }
  };

  const installCommands = `# 1. Установите Ollama (бесплатный AI для текста)
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1

# 2. Скачайте проект
# (используйте кнопку "Скачать весь проект" выше)

# 3. Распакуйте архив
unzip content-factory.zip
cd content-factory

# 4. Установите зависимости
go mod download

# 5. Настройте конфиг
cp configs/config.yaml.example configs/config.yaml
nano configs/config.yaml

# 6. Запустите
go run cmd/main.go`;

  const dockerCommands = `# Сборка образа
docker build -t content-factory .

# Запуск
docker run -d --name content-factory \\
  -v ./configs:/app/configs \\
  -v .//app/data \\
  --network host \\
  content-factory

# Или через docker-compose
docker-compose up -d`;

  const publishCommands = `# Способ 1: С помощью GitHub CLI (рекомендуется)
# Установите GitHub CLI: https://cli.github.com/

# Авторизуйтесь
gh auth login

# Опубликуйте проект
./publish.sh

# Способ 2: Вручную
# 1. Создайте репозиторий на https://github.com/new
# 2. Выполните команды:

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/content-factory.git
git push -u origin main`;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Скачать проект</h1>
        <p className="text-gray-400 mt-1">Полный исходный код Go проекта — готов к запуску</p>
      </div>

      {/* Download Button */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package size={24} className="text-green-400" />
              Скачать весь проект
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {PROJECT_FILES.length} файлов • Go проект полностью готов к запуску
            </p>
          </div>
          <button
            onClick={handleDownloadAll}
            disabled={downloading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              downloading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20'
            }`}
          >
            {downloading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Скачивание...
              </>
            ) : (
              <>
                <Download size={20} />
                Скачать ZIP архив
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">{progress.currentFile}</span>
              <span className="text-sm text-gray-400">
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              ></div>
            </div>
            {progress.status === 'complete' && (
              <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                <Check size={14} />
                Архив создан и скачан!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Start */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Terminal size={20} className="text-blue-400" />
          Быстрый старт
        </h2>
        <div className="relative">
          <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code className="text-green-400 whitespace-pre">{installCommands}</code>
          </pre>
          <button
            onClick={() => handleCopy(installCommands, 'install')}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all"
          >
            {copied === 'install' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied === 'install' ? '✓' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Publish to GitHub */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Github size={20} className="text-purple-400" />
          Опубликовать на GitHub
        </h2>
        <div className="relative">
          <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code className="text-purple-400 whitespace-pre">{publishCommands}</code>
          </pre>
          <button
            onClick={() => handleCopy(publishCommands, 'publish')}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all"
          >
            {copied === 'publish' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied === 'publish' ? '✓' : 'Copy'}
          </button>
        </div>
        <div className="mt-4 flex gap-3">
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-all"
          >
            <Github size={16} />
            Создать репозиторий
          </a>
          <a
            href="https://cli.github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all"
          >
            <BookOpen size={16} />
            GitHub CLI
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center gap-2">
            <FolderOpen size={18} className="text-yellow-400" />
            <h2 className="font-bold">Файлы проекта ({PROJECT_FILES.length})</h2>
          </div>
          <div className="p-3 max-h-[500px] overflow-y-auto">
            <div className="space-y-1">
              {PROJECT_FILES.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-all group"
                >
                  <FileCode size={14} className="text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-gray-300 truncate">{file.path}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(file.path, file.url)}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Download size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Docker */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-bold">Docker запуск</h2>
            </div>
            <div className="p-4">
              <div className="relative">
                <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <code className="text-blue-400 whitespace-pre">{dockerCommands}</code>
                </pre>
                <button
                  onClick={() => handleCopy(dockerCommands, 'docker')}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all"
                >
                  {copied === 'docker' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied === 'docker' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h2 className="font-bold mb-3">Полезные ссылки</h2>
            <div className="space-y-2">
              {[
                { name: 'Ollama — скачать', url: 'https://ollama.com', desc: 'Бесплатный локальный AI' },
                { name: 'Groq API ключ', url: 'https://console.groq.com/keys', desc: '14400 запросов/день' },
                { name: 'Gemini API ключ', url: 'https://aistudio.google.com/app/apikey', desc: '1500 запросов/день' },
                { name: 'HuggingFace токен', url: 'https://huggingface.co/settings/tokens', desc: 'Бесплатный лимит' },
                { name: 'Pollinations.ai', url: 'https://pollinations.ai', desc: 'Картинки без ключа' },
                { name: 'Kandinsky (Сбер)', url: 'https://developers.sber.ru/studio/workspaces', desc: '1000 генераций/мес' },
                { name: 'Telegram BotFather', url: 'https://t.me/BotFather', desc: 'Создать бота' },
                { name: 'Яндекс Дзен API', url: 'https://yandex.ru/dev/dzen/api/', desc: 'Документация API' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-all group"
                >
                  <ExternalLink size={14} className="text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 group-hover:text-white">{link.name}</p>
                    <p className="text-xs text-gray-500">{link.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Min Config */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Минимальная конфигурация (без API ключей)</h2>
        <div className="relative">
          <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code className="text-gray-300 whitespace-pre">{`text:
  provider: "ollama"
  ollama:
    url: "http://localhost:11434"
    model: "llama3.1"

image:
  provider: "pollinations"  # Без ключа!

telegram:
  bot_token: "YOUR_TOKEN"
  admin_chat_id: YOUR_ID

dzen:
  oauth_token: "YOUR_TOKEN"
  channel_id: "YOUR_ID"`}</code>
          </pre>
        </div>
        <p className="text-sm text-green-400 mt-3">💰 Эта конфигурация стоит $0.00/мес</p>
      </div>
    </div>
  );
}
