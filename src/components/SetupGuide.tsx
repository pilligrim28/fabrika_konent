import { CheckCircle, ExternalLink, Terminal, Key, Globe, Bot, Cpu, Image, Shield } from 'lucide-react';

export default function SetupGuide() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Руководство по настройке</h1>
        <p className="text-gray-400 mt-1">Все модели — бесплатные. Стоимость: $0/мес</p>
      </div>

      {/* FREE Models Overview */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30 mb-8">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Shield size={20} className="text-green-400" />
          Бесплатные модели — 100% без оплаты
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="font-bold text-blue-400 flex items-center gap-2"><Cpu size={16} /> Текст (4 варианта)</h3>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>✅ <strong>Ollama</strong> — локально, безлимитно</li>
              <li>✅ <strong>Groq</strong> — 14400 запросов/день</li>
              <li>✅ <strong>Google Gemini</strong> — 1500 запросов/день</li>
              <li>✅ <strong>HuggingFace</strong> — бесплатный лимит</li>
            </ul>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="font-bold text-purple-400 flex items-center gap-2"><Image size={16} /> Картинки (3 варианта)</h3>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>✅ <strong>Pollinations.ai</strong> — безлимитно, без ключа!</li>
              <li>✅ <strong>Kandinsky</strong> — 1000 генераций/мес</li>
              <li>✅ <strong>HuggingFace SD</strong> — бесплатный лимит</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step 1: Text AI */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
            <Cpu size={24} />
          </div>
          <h2 className="text-xl font-bold">1. Выберите AI для текста</h2>
        </div>

        <div className="space-y-4">
          {/* Ollama */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-green-400">🏆 Ollama (рекомендуется)</h3>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">БЕЗЛИМИТНО</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Локальная генерация. Работает на вашем компьютере. Никаких API ключей!</p>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-1 mb-3">
              <p className="text-gray-500"># Установка Ollama:</p>
              <p className="text-green-400"># Linux/Mac:</p>
              <p className="text-white">curl -fsSL https://ollama.com/install.sh | sh</p>
              <p className="text-gray-500 mt-2"># Windows: скачать с сайта</p>
              <p className="text-green-400 mt-2"># Загрузка модели:</p>
              <p className="text-white">ollama pull llama3.1</p>
              <p className="text-white">ollama pull mistral</p>
              <p className="text-white">ollama pull qwen2.5</p>
              <p className="text-gray-500 mt-2"># Запуск сервера:</p>
              <p className="text-white">ollama serve</p>
            </div>
            <a href="https://ollama.com" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300">
              <ExternalLink size={14} /> ollama.com — скачать
            </a>
          </div>

          {/* Groq */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-yellow-400">⚡ Groq (самый быстрый)</h3>
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">14400/день</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Облачный API. Llama 3.1 работает за миллисекунды!</p>
            <div className="space-y-2">
              <a href="https://console.groq.com/keys" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg">
                <Key size={14} /> Получить бесплатный API ключ → console.groq.com/keys
              </a>
              <p className="text-xs text-gray-500">Модели: llama-3.1-8b-instant, llama-3.1-70b-versatile, mixtral-8x7b-32768</p>
            </div>
          </div>

          {/* Gemini */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-red-400">🔥 Google Gemini Flash</h3>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">1500/день</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">От Google. Очень качественная модель, бесплатный тариф.</p>
            <div className="space-y-2">
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg">
                <Key size={14} /> Получить бесплатный API ключ → aistudio.google.com
              </a>
              <p className="text-xs text-gray-500">Модели: gemini-1.5-flash (быстрая), gemini-1.5-pro (качественная)</p>
            </div>
          </div>

          {/* HuggingFace */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-orange-400">🤗 HuggingFace</h3>
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">Бесплатный лимит</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Доступ к тысячам моделей. Mistral, Llama, Qwen и другие.</p>
            <div className="space-y-2">
              <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg">
                <Key size={14} /> Получить бесплатный токен → huggingface.co/settings/tokens
              </a>
              <p className="text-xs text-gray-500">Модели: mistralai/Mistral-7B-Instruct-v0.3, meta-llama/Llama-3.1-8B-Instruct</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Image AI */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-600/20 text-purple-400 rounded-lg flex items-center justify-center">
            <Image size={24} />
          </div>
          <h2 className="text-xl font-bold">2. Выберите AI для картинок</h2>
        </div>

        <div className="space-y-4">
          {/* Pollinations */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-green-400">🏆 Pollinations.ai (рекомендуется)</h3>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">БЕЗ КЛЮЧА!</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Полностью бесплатно. Не нужен API ключ. Просто HTTP запрос!</p>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs mb-3">
              <p className="text-gray-500"># Пример запроса (работает прямо сейчас!):</p>
              <p className="text-green-400 break-all">https://image.pollinations.ai/prompt/beautiful+sunset+over+mountains?width=1024&height=576</p>
            </div>
            <a href="https://pollinations.ai" target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300">
              <ExternalLink size={14} /> pollinations.ai — документация
            </a>
          </div>

          {/* Kandinsky */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-blue-400">🎨 Kandinsky (от Сбера)</h3>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">1000/мес бесплатно</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Российская нейросеть. Отличное качество для русскоязычных промптов.</p>
            <div className="space-y-2">
              <a href="https://developers.sber.ru/studio/workspaces" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg">
                <Key size={14} /> Получить доступ → developers.sber.ru/studio
              </a>
              <p className="text-xs text-gray-500">Нужно: Auth Key (Basic) и Scope. Бесплатно 1000 генераций/мес.</p>
            </div>
          </div>

          {/* HuggingFace Images */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-orange-400">🤗 HuggingFace SD</h3>
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">Бесплатный лимит</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Stable Diffusion через HuggingFace. Тот же токен что и для текста.</p>
            <div className="space-y-2">
              <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg">
                <Key size={14} /> Токен → huggingface.co/settings/tokens
              </a>
              <p className="text-xs text-gray-500">Модели: stabilityai/stable-diffusion-xl-base-1.0, runwayml/stable-diffusion-v1-5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Telegram */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cyan-600/20 text-cyan-400 rounded-lg flex items-center justify-center">
            <Bot size={24} />
          </div>
          <h2 className="text-xl font-bold">3. Telegram бот</h2>
        </div>

        <div className="space-y-3">
          <a href="https://t.me/BotFather" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg">
            <Key size={14} /> Создать бота → @BotFather в Telegram
          </a>
          <div className="bg-gray-900 rounded-lg p-3 text-sm">
            <p className="text-gray-400">1. Откройте <a href="https://t.me/BotFather" target="_blank" className="text-blue-400">@BotFather</a></p>
            <p className="text-gray-400">2. Отправьте /newbot</p>
            <p className="text-gray-400">3. Укажите имя и username</p>
            <p className="text-gray-400">4. Скопируйте токен</p>
            <p className="text-gray-400 mt-2">5. Узнайте свой chat_id:</p>
            <p className="text-blue-400">→ <a href="https://t.me/userinfobot" target="_blank" className="underline">@userinfobot</a></p>
          </div>
        </div>
      </div>

      {/* Step 4: Yandex Dzen */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-600/20 text-red-400 rounded-lg flex items-center justify-center">
            <Globe size={24} />
          </div>
          <h2 className="text-xl font-bold">4. Яндекс Дзен API</h2>
        </div>

        <div className="space-y-3">
          <a href="https://dzen.ru/oauth" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg">
            <Key size={14} /> Получить OAuth токен → dzen.ru
          </a>
          <div className="bg-gray-900 rounded-lg p-3 text-sm space-y-1">
            <p className="text-gray-400">1. Зайдите в настройки канала на Дзен</p>
            <p className="text-gray-400">2. Перейдите в раздел "API доступ"</p>
            <p className="text-gray-400">3. Создайте OAuth-токен</p>
            <p className="text-gray-400">4. Скопируйте channel_id из URL канала</p>
          </div>
          <p className="text-xs text-gray-500">Документация API: <a href="https://yandex.ru/dev/dzen/api/" target="_blank" className="text-blue-400">yandex.ru/dev/dzen/api</a></p>
        </div>
      </div>

      {/* Step 5: Quick Start */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30 mb-6">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Terminal size={20} />
          Быстрый старт
        </h2>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-1">
          <p className="text-gray-500"># 1. Установите Ollama (бесплатный текст):</p>
          <p className="text-green-400">curl -fsSL https://ollama.com/install.sh | sh</p>
          <p className="text-green-400">ollama pull llama3.1</p>
          <p className="text-gray-500 mt-2"># 2. Клонируйте проект:</p>
          <p className="text-green-400">git clone https://github.com/yourname/content-factory</p>
          <p className="text-green-400">cd content-factory</p>
          <p className="text-gray-500 mt-2"># 3. Настройте конфиг (все бесплатные модели!):</p>
          <p className="text-green-400">cp configs/config.yaml.example configs/config.yaml</p>
          <p className="text-green-400">nano configs/config.yaml</p>
          <p className="text-gray-500 mt-2"># 4. Установите зависимости и запустите:</p>
          <p className="text-green-400">go mod download</p>
          <p className="text-green-400">go run cmd/main.go</p>
        </div>
      </div>

      {/* Docker */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-3">Docker запуск</h2>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-1">
          <p className="text-green-400">docker build -t content-factory .</p>
          <p className="text-green-400">docker run -d --name cf \</p>
          <p className="text-green-400 pl-4">-v ./configs:/app/configs \</p>
          <p className="text-green-400 pl-4">-v ./data:/app/data \</p>
          <p className="text-green-400 pl-4">--network host \</p>
          <p className="text-green-400 pl-4">content-factory</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">--network host нужен для доступа к Ollama на localhost:11434</p>
      </div>
    </div>
  );
}
