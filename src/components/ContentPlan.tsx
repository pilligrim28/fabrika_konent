import { Calendar, CheckCircle, Clock, FileText, Image, Send } from 'lucide-react';
import { useState } from 'react';

interface ContentItem {
  id: number;
  date: string;
  time: string;
  title: string;
  type: 'article' | 'post' | 'video-script';
  status: 'planned' | 'generating' | 'ready' | 'published';
  topic: string;
  keywords: string[];
}

export default function ContentPlan() {
  const [selectedDay, setSelectedDay] = useState(0);

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  });

  const contentPlan: ContentItem[] = [
    { id: 1, date: '2024-01-15', time: '09:00', title: '10 способов повысить продуктивность', type: 'article', status: 'published', topic: 'Саморазвитие', keywords: ['продуктивность', 'тайм-менеджмент'] },
    { id: 2, date: '2024-01-15', time: '14:00', title: 'Обзор нейросетей 2024', type: 'article', status: 'ready', topic: 'Технологии', keywords: ['AI', 'нейросети'] },
    { id: 3, date: '2024-01-15', time: '18:00', title: 'Рецепт идеального борща', type: 'post', status: 'generating', topic: 'Кулинария', keywords: ['рецепты', 'борщ'] },
    { id: 4, date: '2024-01-16', time: '09:00', title: 'Как начать инвестировать с нуля', type: 'article', status: 'planned', topic: 'Финансы', keywords: ['инвестиции', 'финансы'] },
    { id: 5, date: '2024-01-16', time: '14:00', title: 'Топ-5 мест для путешествий зимой', type: 'article', status: 'planned', topic: 'Путешествия', keywords: ['путешествия', 'зима'] },
    { id: 6, date: '2024-01-16', time: '18:00', title: 'Утренние привычки успешных людей', type: 'post', status: 'planned', topic: 'Саморазвитие', keywords: ['привычки', 'утро'] },
    { id: 7, date: '2024-01-17', time: '09:00', title: 'Обзор iPhone 16 Pro', type: 'article', status: 'planned', topic: 'Технологии', keywords: ['iPhone', 'обзор'] },
    { id: 8, date: '2024-01-17', time: '14:00', title: 'Домашняя йога для начинающих', type: 'article', status: 'planned', topic: 'Здоровье', keywords: ['йога', 'здоровье'] },
    { id: 9, date: '2024-01-17', time: '18:00', title: 'Финансовая грамотность: основы', type: 'post', status: 'planned', topic: 'Финансы', keywords: ['финансы', 'бюджет'] },
    { id: 10, date: '2024-01-18', time: '09:00', title: 'Как создать свой стартап', type: 'article', status: 'planned', topic: 'Бизнес', keywords: ['стартап', 'бизнес'] },
    { id: 11, date: '2024-01-18', time: '14:00', title: 'Лучшие книги 2024 года', type: 'article', status: 'planned', topic: 'Культура', keywords: ['книги', 'рейтинг'] },
    { id: 12, date: '2024-01-18', time: '18:00', title: 'Простые рецепты на каждый день', type: 'post', status: 'planned', topic: 'Кулинария', keywords: ['рецепты', 'быстро'] },
  ];

  const dayContent = contentPlan.filter((_, i) => Math.floor(i / 3) === selectedDay);

  const getStatusBadge = (status: ContentItem['status']) => {
    switch (status) {
      case 'published': return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1"><CheckCircle size={12} /> Опубликовано</span>;
      case 'ready': return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1"><FileText size={12} /> Готово</span>;
      case 'generating': return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1"><Clock size={12} /> Генерация</span>;
      case 'planned': return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full flex items-center gap-1"><Calendar size={12} /> Запланировано</span>;
    }
  };

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'article': return <FileText size={14} className="text-blue-400" />;
      case 'post': return <Image size={14} className="text-purple-400" />;
      case 'video-script': return <Send size={14} className="text-green-400" />;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Контент-план</h1>
        <p className="text-gray-400 mt-1">Расписание публикаций на неделю. Просмотр через Telegram: <code className="bg-gray-700 px-2 py-1 rounded text-blue-400">/plan</code></p>
      </div>

      {/* Week Navigation */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {weekDays.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`flex-1 min-w-[80px] p-3 rounded-lg text-center transition-all ${
                selectedDay === i
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <p className="text-sm font-bold">{day}</p>
              <p className="text-xs opacity-70">{dates[i]}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Content Items */}
      <div className="space-y-4">
        {dayContent.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  {getTypeIcon(item.type)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-gray-400">{item.time}</span>
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">{item.topic}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {item.keywords.map((kw, ki) => (
                      <span key={ki} className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">#{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
              {getStatusBadge(item.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Telegram Commands */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Команды Telegram для контент-плана</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <code className="text-blue-400 font-mono">/plan</code>
            <p className="text-sm text-gray-400 mt-1">Показать контент-план на сегодня</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <code className="text-blue-400 font-mono">/plan week</code>
            <p className="text-sm text-gray-400 mt-1">План на всю неделю</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <code className="text-blue-400 font-mono">/plan add [тема]</code>
            <p className="text-sm text-gray-400 mt-1">Добавить тему в план</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <code className="text-blue-400 font-mono">/status</code>
            <p className="text-sm text-gray-400 mt-1">Статус текущих задач</p>
          </div>
        </div>
      </div>
    </div>
  );
}
