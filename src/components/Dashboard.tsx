import { FileText, Image, Send, Clock, TrendingUp, CheckCircle, AlertCircle, Zap, Shield } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Статей создано', value: '24', icon: FileText, color: 'from-blue-500 to-blue-600', change: '+5 сегодня' },
    { label: 'Картинок сгенерировано', value: '48', icon: Image, color: 'from-purple-500 to-purple-600', change: '+12 сегодня' },
    { label: 'Опубликовано в Дзен', value: '18', icon: Send, color: 'from-green-500 to-green-600', change: '+3 сегодня' },
    { label: 'В очереди', value: '6', icon: Clock, color: 'from-orange-500 to-orange-600', change: 'Следующее через 2ч' },
  ];

  const recentActivity = [
    { time: '10:30', action: 'Статья опубликована', detail: '"10 способов улучшить продуктивность"', status: 'success' },
    { time: '10:25', action: 'Картинка сгенерирована', detail: 'Pollinations.ai — обложка создана', status: 'success' },
    { time: '10:20', action: 'Текст создан', detail: 'Ollama (llama3.1) — 1200 слов', status: 'success' },
    { time: '09:00', action: 'Контент-план обновлён', detail: 'Добавлено 7 новых тем на неделю', status: 'info' },
    { time: '08:00', action: 'Telegram уведомление', detail: 'Утренний отчёт отправлен', status: 'success' },
    { time: '07:30', action: 'Таймаут Ollama', detail: 'Модель перезагружена автоматически', status: 'error' },
  ];

  const pipeline = [
    { step: 'Генерация темы', status: 'done', desc: 'Ollama выбирает тему из контент-плана' },
    { step: 'Создание текста', status: 'done', desc: 'Llama 3.1 / Groq / Gemini пишет статью' },
    { step: 'Генерация картинок', status: 'active', desc: 'Pollinations.ai создаёт обложку' },
    { step: 'Публикация', status: 'pending', desc: 'Отправка в Яндекс Дзен API' },
    { step: 'Уведомление', status: 'pending', desc: 'Telegram бот сообщает результат' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Дашборд</h1>
            <p className="text-gray-400 mt-1">Обзор работы контент-фабрики</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Shield size={18} className="text-green-400" />
            <span className="text-green-400 font-bold">БЕСПЛАТНО</span>
            <span className="text-gray-500 text-sm">$0.00/мес</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs text-gray-500">{stat.change}</span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" />
            Текущий пайплайн
          </h2>
          <div className="space-y-4">
            {pipeline.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  item.status === 'done' ? 'bg-green-500/20 text-green-400' :
                  item.status === 'active' ? 'bg-blue-500/20 text-blue-400 animate-pulse' :
                  'bg-gray-700 text-gray-500'
                }`}>
                  {item.status === 'done' ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${item.status === 'pending' ? 'text-gray-500' : 'text-white'}`}>
                    {item.step}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                {item.status === 'active' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-500" />
            Последняя активность
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/30">
                <div className={`mt-1 ${
                  item.status === 'success' ? 'text-green-400' :
                  item.status === 'error' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {item.status === 'success' ? <CheckCircle size={16} /> :
                   item.status === 'error' ? <AlertCircle size={16} /> :
                   <Clock size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-gray-500 truncate">{item.detail}</p>
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Models Used - FREE */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield size={20} className="text-green-400" />
          Используемые бесплатные AI модели
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
            <h3 className="font-bold text-blue-400">Текст (выберите один)</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Ollama (локально)</span>
                <span className="text-xs text-green-400">∞ безлимит</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Groq (Llama 3.1)</span>
                <span className="text-xs text-green-400">14400/день</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Gemini Flash</span>
                <span className="text-xs text-green-400">1500/день</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">HuggingFace</span>
                <span className="text-xs text-green-400">лимит</span>
              </div>
            </div>
            <span className="inline-block mt-3 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">$0.00</span>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
            <h3 className="font-bold text-purple-400">Картинки (выберите один)</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Pollinations.ai</span>
                <span className="text-xs text-green-400">∞ без ключа</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Kandinsky (Сбер)</span>
                <span className="text-xs text-green-400">1000/мес</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">HF Stable Diffusion</span>
                <span className="text-xs text-green-400">лимит</span>
              </div>
            </div>
            <span className="inline-block mt-3 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">$0.00</span>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
            <h3 className="font-bold text-orange-400">Ссылки для регистрации</h3>
            <div className="mt-2 space-y-2">
              <a href="https://ollama.com" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                → ollama.com (скачать)
              </a>
              <a href="https://console.groq.com/keys" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                → console.groq.com/keys
              </a>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                → aistudio.google.com
              </a>
              <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                → huggingface.co/tokens
              </a>
              <a href="https://pollinations.ai" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                → pollinations.ai
              </a>
              <a href="https://developers.sber.ru/studio/workspaces" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                → developers.sber.ru
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Comparison */}
      <div className="mt-6 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-xl p-6 border border-green-500/30">
        <h2 className="text-xl font-bold mb-4">💰 Экономия: бесплатные vs платные</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-red-400 font-bold mb-2">❌ Платные сервисы</h3>
            <div className="space-y-1 text-sm text-gray-400">
              <p>OpenAI GPT-4o-mini: ~$5-15/мес</p>
              <p>Flux Pro: ~$3-10/мес</p>
              <p>DALL-E 3: ~$5-15/мес</p>
              <p className="font-bold text-red-400 mt-2">Итого: $15-40/мес</p>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/30">
            <h3 className="text-green-400 font-bold mb-2">✅ Наши бесплатные</h3>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Ollama / Groq / Gemini: $0</p>
              <p>Pollinations.ai: $0</p>
              <p>Kandinsky: $0</p>
              <p className="font-bold text-green-400 mt-2">Итого: $0.00/мес 🎉</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
