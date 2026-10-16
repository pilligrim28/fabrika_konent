import { Download, FileCode, FolderOpen, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function DownloadProject() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const installCommands = `# 1. Установите Ollama (бесплатный AI для текста)
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1

# 2. Клонируйте или скачайте проект
git clone https://github.com/yourname/content-factory
cd content-factory

# 3. Установите зависимости
go mod download

# 4. Настройте конфиг
cp configs/config.yaml.example configs/config.yaml
nano configs/config.yaml

# 5. Запустите
go run cmd/main.go`;

  const dockerCommands = `# Сборка образа
docker build -t content-factory .

# Запуск
docker run -d --name content-factory \\
  -v ./configs:/app/configs \\
  -v ./data:/app/data \\
  --network host \\
  content-factory

# Или через docker-compose
docker-compose up -d`;

  const fileList = [
    { path: 'cmd/main.go', desc: 'Точка входа' },
    { path: 'configs/config.yaml', desc: 'Конфигурация' },
    { path: 'internal/config/config.go', desc: 'Загрузка конфига' },
    { path: 'internal/models/models.go', desc: 'Модели данных' },
    { path: 'internal/storage/storage.go', desc: 'SQLite база' },
    { path: 'internal/ai/provider.go', desc: 'Интерфейсы AI' },
    { path: 'internal/ai/ollama.go', desc: 'Ollama (бесплатно)' },
    { path: 'internal/ai/groq.go', desc: 'Groq (бесплатно)' },
    { path: 'internal/ai/gemini.go', desc: 'Gemini (бесплатно)' },
    { path: 'internal/ai/huggingface_text.go', desc: 'HuggingFace текст' },
    { path: 'internal/ai/image_pollinations.go', desc: 'Pollinations (без ключа!)' },
    { path: 'internal/ai/image_kandinsky.go', desc: 'Kandinsky (Сбер)' },
    { path: 'internal/ai/image_huggingface.go', desc: 'HF Stable Diffusion' },
    { path: 'internal/scheduler/scheduler.go', desc: 'Cron планировщик' },
    { path: 'internal/bot/bot.go', desc: 'Telegram бот' },
    { path: 'internal/dzen/dzen.go', desc: 'Яндекс Дзен API' },
    { path: 'Dockerfile', desc: 'Docker образ' },
    { path: 'docker-compose.yml', desc: 'Docker Compose' },
    { path: 'README.md', desc: 'Документация' },
    { path: 'go.mod', desc: 'Go модули' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Скачать проект</h1>
        <p className="text-gray-400 mt-1">Полный исходный код Go проекта — готов к запуску</p>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Terminal size={20} className="text-green-400" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center gap-2">
            <FolderOpen size={18} className="text-yellow-400" />
            <h2 className="font-bold">Файлы проекта ({fileList.length})</h2>
          </div>
          <div className="p-3 max-h-[500px] overflow-y-auto">
            <div className="space-y-1">
              {fileList.map((file, i) => (
                <a
                  key={i}
                  href={`/go-source/${file.path}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-all group"
                >
                  <FileCode size={14} className="text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-gray-300 group-hover:text-white truncate">{file.path}</p>
                    <p className="text-xs text-gray-500">{file.desc}</p>
                  </div>
                  <Download size={14} className="text-gray-600 group-hover:text-gray-400 flex-shrink-0" />
                </a>
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
                  rel="noopener"
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
