import { FileText, Image, Send, Clock, TrendingUp, CheckCircle, AlertCircle, Zap } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Статей создано', value: '24', icon: FileText, color: 'from-blue-500 to-blue-600', change: '+5 сегодня' },
    { label: 'Картинок сгенерировано', value: '48', icon: Image, color: 'from-purple-500 to-purple-600', change: '+12 сегодня' },
    { label: 'Опубликовано в Дзен', value: '18', icon: Send, color: 'from-green-500 to-green-600', change: '+3 сегодня' },
    { label: 'В очереди', value: '6', icon: Clock, color: 'from-orange-500 to-orange-600', change: 'Следующее через 2ч' },
  ];

  const recentActivity = [
    { time: '10:30', action: 'Статья опубликована', detail: '"10 способов улучшить продуктивность"', status: 'success' },
    { time: '10:25', action: 'Картинка сгенерирована', detail: 'Обложка для статьи о продуктивности', status: 'success' },
    { time: '10:20', action: 'Текст создан', detail: 'AI сгенерировал статью (1200 слов)', status: 'success' },
    { time: '09:00', action: 'Контент-план обновлён', detail: 'Добавлено 7 новых тем на неделю', status: 'info' },
    { time: '08:00', action: 'Telegram уведомление', detail: 'Утренний отчёт отправлен', status: 'success' },
    { time: '07:30', action: 'Ошибка API', detail: 'Таймаут при генерации картинки', status: 'error' },
  ];

  const pipeline = [
    { step: 'Генерация темы', status: 'done', desc: 'AI выбирает тему из контент-плана' },
    { step: 'Создание текста', status: 'done', desc: 'GPT-4o-mini генерирует статью' },
    { step: 'Генерация картинок', status: 'active', desc: 'Flux/Kandinsky создаёт обложку' },
    { step: 'Публикация', status: 'pending', desc: 'Отправка в Яндекс Дзен' },
    { step: 'Уведомление', status: 'pending', desc: 'Telegram бот сообщает результат' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Дашборд</h1>
        <p className="text-gray-400 mt-1">Обзор работы контент-фабрики</p>
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

      {/* AI Models Used */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Используемые AI модели</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-bold text-blue-400">Текст</h3>
            <p className="text-sm text-gray-300 mt-1">GPT-4o-mini (OpenAI)</p>
            <p className="text-xs text-gray-500 mt-2">~$0.15 / 1M токенов (ввод)</p>
            <p className="text-xs text-gray-500">~$0.60 / 1M токенов (вывод)</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Дёшево</span>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-bold text-purple-400">Картинки</h3>
            <p className="text-sm text-gray-300 mt-1">Flux (BFL) / Kandinsky</p>
            <p className="text-xs text-gray-500 mt-2">Flux: ~$0.03/картинка</p>
            <p className="text-xs text-gray-500">Kandinsky: Бесплатно (Сбер)</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Бесплатно/Дёшево</span>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-bold text-orange-400">Альтернативы</h3>
            <p className="text-sm text-gray-300 mt-1">Ollama (локально)</p>
            <p className="text-xs text-gray-500 mt-2">Llama 3.1, Mistral, Qwen</p>
            <p className="text-xs text-gray-500">Полностью бесплатно</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Локально</span>
          </div>
        </div>
      </div>
    </div>
  );
}
