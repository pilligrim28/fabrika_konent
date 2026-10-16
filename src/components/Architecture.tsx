import { Database, Cpu, Globe, Bot, Image, FileText, ArrowRight, Server } from 'lucide-react';

export default function Architecture() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Архитектура системы</h1>
        <p className="text-gray-400 mt-1">Как устроена контент-фабрика на Go</p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-6 text-center">Схема работы системы</h2>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Scheduler */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 w-full max-w-md text-center shadow-lg">
            <Server size={24} className="mx-auto mb-2" />
            <h3 className="font-bold">Scheduler (Планировщик)</h3>
            <p className="text-xs text-blue-200">Cron-задачи, управление расписанием</p>
          </div>
          
          <ArrowRight className="rotate-90 text-gray-500" />

          {/* AI Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-center shadow-lg">
              <Cpu size={24} className="mx-auto mb-2" />
              <h3 className="font-bold text-sm">AI Текст</h3>
              <p className="text-xs text-purple-200 mt-1">GPT-4o-mini / Ollama</p>
              <p className="text-xs text-purple-300 mt-1">Генерация статей</p>
            </div>
            <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-4 text-center shadow-lg">
              <Image size={24} className="mx-auto mb-2" />
              <h3 className="font-bold text-sm">AI Картинки</h3>
              <p className="text-xs text-pink-200 mt-1">Flux / Kandinsky</p>
              <p className="text-xs text-pink-300 mt-1">Обложки и иллюстрации</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 text-center shadow-lg">
              <Bot size={24} className="mx-auto mb-2" />
              <h3 className="font-bold text-sm">Telegram Bot</h3>
              <p className="text-xs text-green-200 mt-1">Управление и отчёты</p>
              <p className="text-xs text-green-300 mt-1">Команды /plan /status</p>
            </div>
          </div>

          <ArrowRight className="rotate-90 text-gray-500" />

          {/* Database */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4 w-full max-w-md text-center shadow-lg">
            <Database size={24} className="mx-auto mb-2" />
            <h3 className="font-bold">База данных (SQLite/PostgreSQL)</h3>
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

      {/* Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Технологии</h2>
          <div className="space-y-3">
            {[
              { name: 'Go 1.21+', desc: 'Основной язык, конкурентность' },
              { name: 'SQLite / PostgreSQL', desc: 'Хранение данных' },
              { name: 'go-telegram-bot-api', desc: 'Telegram бот' },
              { name: 'robfig/cron', desc: 'Планировщик задач' },
              { name: 'OpenAI API', desc: 'GPT-4o-mini для текстов' },
              { name: 'Flux API / Kandinsky', desc: 'Генерация изображений' },
              { name: 'Яндекс Дзен API', desc: 'Публикация контента' },
            ].map((tech, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/30">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">{tech.name}</p>
                  <p className="text-xs text-gray-500">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Структура проекта</h2>
          <div className="font-mono text-sm space-y-1">
            <p className="text-yellow-400">content-factory/</p>
            <p className="text-gray-400 pl-4">├── <span className="text-green-400">cmd/</span></p>
            <p className="text-gray-400 pl-8">│   ├── main.go <span className="text-gray-600"># Точка входа</span></p>
            <p className="text-gray-400 pl-8">│   └── worker/ <span className="text-gray-600"># Воркеры</span></p>
            <p className="text-gray-400 pl-4">├── <span className="text-green-400">internal/</span></p>
            <p className="text-gray-400 pl-8">│   ├── ai/ <span className="text-gray-600"># AI сервисы</span></p>
            <p className="text-gray-400 pl-8">│   ├── bot/ <span className="text-gray-600"># Telegram бот</span></p>
            <p className="text-gray-400 pl-8">│   ├── dzen/ <span className="text-gray-600"># Дзен API</span></p>
            <p className="text-gray-400 pl-8">│   ├── scheduler/ <span className="text-gray-600"># Крон</span></p>
            <p className="text-gray-400 pl-8">│   ├── storage/ <span className="text-gray-600"># БД</span></p>
            <p className="text-gray-400 pl-8">│   └── models/ <span className="text-gray-600"># Модели</span></p>
            <p className="text-gray-400 pl-4">├── <span className="text-green-400">configs/</span></p>
            <p className="text-gray-400 pl-8">│   └── config.yaml</p>
            <p className="text-gray-400 pl-4">├── <span className="text-green-400">migrations/</span></p>
            <p className="text-gray-400 pl-4">├── go.mod</p>
            <p className="text-gray-400 pl-4">├── go.sum</p>
            <p className="text-gray-400 pl-4">└── Dockerfile</p>
          </div>
        </div>
      </div>

      {/* Data Flow */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Поток данных</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400">Этап</th>
                <th className="text-left py-3 px-4 text-gray-400">Действие</th>
                <th className="text-left py-3 px-4 text-gray-400">Время</th>
                <th className="text-left py-3 px-4 text-gray-400">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 font-medium">1. Выбор темы</td>
                <td className="py-3 px-4 text-gray-400">AI анализирует контент-план, выбирает тему</td>
                <td className="py-3 px-4 text-gray-400">~2 сек</td>
                <td className="py-3 px-4 text-green-400">$0.001</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 font-medium">2. Генерация текста</td>
                <td className="py-3 px-4 text-gray-400">GPT-4o-mini пишет статью 1000-2000 слов</td>
                <td className="py-3 px-4 text-gray-400">~30 сек</td>
                <td className="py-3 px-4 text-green-400">~$0.01</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 font-medium">3. Генерация картинок</td>
                <td className="py-3 px-4 text-gray-400">Flux/Kandinsky создаёт обложку</td>
                <td className="py-3 px-4 text-gray-400">~15 сек</td>
                <td className="py-3 px-4 text-green-400">$0.00-0.03</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 font-medium">4. Публикация</td>
                <td className="py-3 px-4 text-gray-400">API Яндекс Дзен — создание статьи</td>
                <td className="py-3 px-4 text-gray-400">~5 сек</td>
                <td className="py-3 px-4 text-green-400">Бесплатно</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">5. Уведомление</td>
                <td className="py-3 px-4 text-gray-400">Telegram бот отправляет отчёт</td>
                <td className="py-3 px-4 text-gray-400">~1 сек</td>
                <td className="py-3 px-4 text-green-400">Бесплатно</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-4">💰 Итого: ~$0.02-0.05 за одну полную публикацию (статья + картинка)</p>
      </div>
    </div>
  );
}
