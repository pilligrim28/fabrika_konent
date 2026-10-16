import { Database, Cpu, Globe, Bot, Image, FileText, ArrowRight, Server, Zap, Shield } from 'lucide-react';

export default function Architecture() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Архитектура системы</h1>
        <p className="text-gray-400 mt-1">Контент-фабрика на Go с бесплатными AI моделями</p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-6 text-center">Схема работы системы</h2>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Scheduler */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 w-full max-w-md text-center shadow-lg">
            <Server size={24} className="mx-auto mb-2" />
            <h3 className="font-bold">Scheduler (Планировщик)</h3>
            <p className="text-xs text-blue-200">robfig/cron — управление расписанием</p>
          </div>
          
          <ArrowRight className="rotate-90 text-gray-500" />

          {/* AI Services - FREE */}
          <div className="w-full max-w-2xl">
            <div className="text-center mb-3">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                <Shield size={12} className="inline mr-1" /> 100% БЕСПЛАТНЫЕ МОДЕЛИ
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-center shadow-lg">
                <Cpu size={24} className="mx-auto mb-2" />
                <h3 className="font-bold text-sm">AI Текст</h3>
                <p className="text-xs text-blue-200 mt-1">Ollama (локально)</p>
                <p className="text-xs text-blue-200">Groq / Gemini (облако)</p>
                <p className="text-xs text-green-300 mt-1 font-bold">$0.00</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-center shadow-lg">
                <Image size={24} className="mx-auto mb-2" />
                <h3 className="font-bold text-sm">AI Картинки</h3>
                <p className="text-xs text-purple-200 mt-1">Pollinations (без ключа)</p>
                <p className="text-xs text-purple-200">Kandinsky (Сбер)</p>
                <p className="text-xs text-green-300 mt-1 font-bold">$0.00</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 text-center shadow-lg">
                <Bot size={24} className="mx-auto mb-2" />
                <h3 className="font-bold text-sm">Telegram Bot</h3>
                <p className="text-xs text-green-200 mt-1">Управление и отчёты</p>
                <p className="text-xs text-green-200">/plan /status /add</p>
                <p className="text-xs text-green-300 mt-1 font-bold">$0.00</p>
              </div>
            </div>
          </div>

          <ArrowRight className="rotate-90 text-gray-500" />

          {/* Database */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4 w-full max-w-md text-center shadow-lg">
            <Database size={24} className="mx-auto mb-2" />
            <h3 className="font-bold">База данных (SQLite)</h3>
            <p className="text-xs text-orange-200">Контент-план, статьи, статусы, логи</p>
          </div>

          <ArrowRight className="rotate-90 text-gray-500" />

          {/* Publishing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 text-center shadow-lg">
              <Globe size={24} className="mx-auto mb-2" />
              <h3 className="font-bold text-sm">Яндекс Дзен API</h3>
              <p className="text-xs text-red-200 mt-1">Публикация статей</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-4 text-center shadow-lg">
              <FileText size={24} className="mx-auto mb-2" />
              <h3 className="font-bold text-sm">Telegram Канал</h3>
              <p className="text-xs text-cyan-200 mt-1">Дублирование постов</p>
            </div>
          </div>
        </div>
      </div>

      {/* Free AI Providers Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Cpu size={20} className="text-blue-400" />
            Бесплатные AI для текста
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Ollama', desc: 'Локально, безлимитно. Llama 3.1, Mistral, Qwen', link: 'https://ollama.com', limit: '∞' },
              { name: 'Groq', desc: 'Облако, очень быстро. Llama 3.1 8B/70B', link: 'https://console.groq.com/keys', limit: '14400/день' },
              { name: 'Google Gemini', desc: 'Flash модель, хорошее качество', link: 'https://aistudio.google.com/app/apikey', limit: '1500/день' },
              { name: 'HuggingFace', desc: 'Mistral, Llama, Qwen через API', link: 'https://huggingface.co/settings/tokens', limit: 'лимит' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <span className="text-xs text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{item.limit}</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <a href={item.link} target="_blank" rel="noopener" className="text-xs text-blue-400 hover:text-blue-300">→</a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Image size={20} className="text-purple-400" />
            Бесплатные AI для картинок
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Pollinations.ai', desc: 'Без API ключа! Просто HTTP GET', link: 'https://pollinations.ai', limit: '∞ безлимит' },
              { name: 'Kandinsky (Сбер)', desc: 'Российская нейросеть, хорошее качество', link: 'https://developers.sber.ru/studio/workspaces', limit: '1000/мес' },
              { name: 'HuggingFace SD', desc: 'Stable Diffusion через HF API', link: 'https://huggingface.co/settings/tokens', limit: 'лимит' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <span className="text-xs text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{item.limit}</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <a href={item.link} target="_blank" rel="noopener" className="text-xs text-blue-400 hover:text-blue-300">→</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Structure */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-bold mb-4">Структура проекта</h2>
        <div className="font-mono text-sm space-y-1">
          <p className="text-yellow-400">content-factory/</p>
          <p className="text-gray-400 pl-4">├── <span className="text-green-400">cmd/</span></p>
          <p className="text-gray-400 pl-8">│   └── main.go <span className="text-gray-600"># Точка входа</span></p>
          <p className="text-gray-400 pl-4">├── <span className="text-green-400">internal/</span></p>
          <p className="text-gray-400 pl-8">│   ├── <span className="text-blue-400">ai/</span></p>
          <p className="text-gray-400 pl-12">│   │   ├── ollama.go <span className="text-gray-600"># Ollama (бесплатно)</span></p>
          <p className="text-gray-400 pl-12">│   │   ├── groq.go <span className="text-gray-600"># Groq (бесплатно)</span></p>
          <p className="text-gray-400 pl-12">│   │   ├── gemini.go <span className="text-gray-600"># Gemini (бесплатно)</span></p>
          <p className="text-gray-400 pl-12">│   │   ├── image_pollinations.go <span className="text-gray-600"># Pollinations</span></p>
          <p className="text-gray-400 pl-12">│   │   ├── image_kandinsky.go <span className="text-gray-600"># Kandinsky</span></p>
          <p className="text-gray-400 pl-12">│   │   └── text_provider.go <span className="text-gray-600"># Интерфейс</span></p>
          <p className="text-gray-400 pl-8">│   ├── <span className="text-cyan-400">bot/</span> <span className="text-gray-600"># Telegram бот</span></p>
          <p className="text-gray-400 pl-8">│   ├── <span className="text-red-400">dzen/</span> <span className="text-gray-600"># Дзен API</span></p>
          <p className="text-gray-400 pl-8">│   ├── <span className="text-yellow-400">scheduler/</span> <span className="text-gray-600"># Cron</span></p>
          <p className="text-gray-400 pl-8">│   ├── <span className="text-orange-400">storage/</span> <span className="text-gray-600"># SQLite</span></p>
          <p className="text-gray-400 pl-8">│   ├── <span className="text-purple-400">config/</span> <span className="text-gray-600"># Конфиг</span></p>
          <p className="text-gray-400 pl-8">│   └── <span className="text-pink-400">models/</span> <span className="text-gray-600"># Модели</span></p>
          <p className="text-gray-400 pl-4">├── <span className="text-green-400">configs/config.yaml</span></p>
          <p className="text-gray-400 pl-4">├── go.mod</p>
          <p className="text-gray-400 pl-4">└── Dockerfile</p>
        </div>
      </div>

      {/* Data Flow */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Поток данных (бесплатно)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400">Этап</th>
                <th className="text-left py-3 px-4 text-gray-400">Сервис</th>
                <th className="text-left py-3 px-4 text-gray-400">Время</th>
                <th className="text-left py-3 px-4 text-gray-400">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 font-medium">1. Выбор темы</td>
                <td className="py-3 px-4 text-gray-400">Ollama / Groq / Gemini</td>
                <td className="py-3 px-4 text-gray-400">~2 сек</td>
                <td className="py-3 px-4 text-green-400 font-bold">$0.00</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 font-medium">2. Генерация текста</td>
                <td className="py-3 px-4 text-gray-400">Llama 3.1 (Ollama/Groq)</td>
                <td className="py-3 px-4 text-gray-400">~10-30 сек</td>
                <td className="py-3 px-4 text-green-400 font-bold">$0.00</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 font-medium">3. Генерация картинок</td>
                <td className="py-3 px-4 text-gray-400">Pollinations.ai</td>
                <td className="py-3 px-4 text-gray-400">~10-20 сек</td>
                <td className="py-3 px-4 text-green-400 font-bold">$0.00</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 font-medium">4. Публикация</td>
                <td className="py-3 px-4 text-gray-400">Яндекс Дзен API</td>
                <td className="py-3 px-4 text-gray-400">~5 сек</td>
                <td className="py-3 px-4 text-green-400 font-bold">$0.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">5. Уведомление</td>
                <td className="py-3 px-4 text-gray-400">Telegram Bot API</td>
                <td className="py-3 px-4 text-gray-400">~1 сек</td>
                <td className="py-3 px-4 text-green-400 font-bold">$0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-400 font-bold">💰 Итого: $0.00 за одну публикацию • $0.00 в месяц • ∞ публикаций</p>
        </div>
      </div>
    </div>
  );
}
