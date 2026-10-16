import { Bot, MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface ChatMessage {
  id: number;
  from: 'user' | 'bot';
  text: string;
  time: string;
}

export default function TelegramBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: 'user', text: '/start', time: '10:00' },
    { id: 2, from: 'bot', text: '🤖 Контент-Фабрика\n\nЯ автоматическая система для создания и публикации контента в Яндекс Дзен.\n\nДоступные команды:\n/plan — контент-план на сегодня\n/plan week — план на неделю\n/status — статус текущих задач\n/generate [тема] — сгенерировать статью\n/add [тема] — добавить в план\n/stats — статистика\n/help — помощь', time: '10:00' },
    { id: 3, from: 'user', text: '/plan', time: '10:01' },
    { id: 4, from: 'bot', text: '📋 Контент-план на 15.01:\n\n✅ 10 способов повысить продуктивность\n   ⏰ 09:00 | 📂 Саморазвитие\n\n🟢 Обзор нейросетей 2024\n   ⏰ 14:00 | 📂 Технологии\n\n🔄 Рецепт идеального борща\n   ⏰ 18:00 | 📂 Кулинария', time: '10:01' },
    { id: 5, from: 'user', text: '/status', time: '10:02' },
    { id: 6, from: 'bot', text: '📊 Статус системы:\n\n✅ Планировщик: активен\n✅ AI генератор: готов\n✅ Telegram: подключен\n⏳ Следующая публикация: через 2ч\n\nПоследние действия:\n• 10:30 — Статья опубликована ✅\n• 10:25 — Картинка создана ✅\n• 10:20 — Текст сгенерирован ✅', time: '10:02' },
    { id: 7, from: 'user', text: '/add Как заработать на криптовалюте', time: '10:05' },
    { id: 8, from: 'bot', text: '✅ Добавлено в план на 16.01:\n📝 Как заработать на криптовалюте', time: '10:05' },
    { id: 9, from: 'user', text: '/stats', time: '10:06' },
    { id: 10, from: 'bot', text: '📊 Статистика:\n\n📝 Статей создано: 24\n🎨 Картинок: 48\n🚀 Опубликовано: 18\n⏳ В очереди: 6\n\n💰 Расходы за месяц: ~$2.50\n📈 Среднее в день: ~$0.08', time: '10:06' },
  ]);

  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessages = [...messages];
    newMessages.push({
      id: newMessages.length + 1,
      from: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    });

    // Simulate bot response
    let response = '';
    if (inputValue.startsWith('/plan week')) {
      response = '📋 Контент-план на неделю:\n\n📅 15.01 (Mon):\n  ✅ 10 способов повысить продуктивность (Саморазвитие)\n  🟢 Обзор нейросетей 2024 (Технологии)\n  🔄 Рецепт идеального борща (Кулинария)\n\n📅 16.01 (Tue):\n  📋 Как начать инвестировать (Финансы)\n  📋 Топ-5 мест для путешествий (Путешествия)\n  📋 Утренние привычки (Саморазвитие)';
    } else if (inputValue === '/plan') {
      response = '📋 Контент-план на сегодня:\n\n✅ 10 способов повысить продуктивность\n   ⏰ 09:00 | 📂 Саморазвитие\n\n🟢 Обзор нейросетей 2024\n   ⏰ 14:00 | 📂 Технологии\n\n🔄 Рецепт идеального борща\n   ⏰ 18:00 | 📂 Кулинария';
    } else if (inputValue === '/status') {
      response = '📊 Статус системы:\n✅ Планировщик: активен\n✅ AI генератор: готов\n✅ Telegram: подключен';
    } else if (inputValue === '/stats') {
      response = '📊 Статистика:\n📝 Статей: 24\n🎨 Картинок: 48\n🚀 Опубликовано: 18\n💰 Расходы: ~$2.50/мес';
    } else if (inputValue.startsWith('/add')) {
      const topic = inputValue.replace('/add ', '');
      response = `✅ Добавлено в план:\n📝 ${topic}`;
    } else if (inputValue === '/help' || inputValue === '/start') {
      response = '🤖 Контент-Фабрика\n\n/plan — план на сегодня\n/plan week — план на неделю\n/status — статус\n/add [тема] — добавить\n/stats — статистика\n/help — помощь';
    } else {
      response = 'Неизвестная команда. Используйте /help';
    }

    newMessages.push({
      id: newMessages.length + 1,
      from: 'bot',
      text: response,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    });

    setMessages(newMessages);
    setInputValue('');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Telegram Бот</h1>
        <p className="text-gray-400 mt-1">Демо интерфейса бота. Все команды работают в реальном Telegram.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Demo */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-750 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-bold">Контент Фабрика Bot</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-3 bg-gray-900/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-3 ${
                    msg.from === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Введите команду..."
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Commands Reference */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-400" />
              Команды бота
            </h3>
            <div className="space-y-2">
              {[
                { cmd: '/start', desc: 'Приветствие и список команд' },
                { cmd: '/plan', desc: 'Контент-план на сегодня' },
                { cmd: '/plan week', desc: 'План на всю неделю' },
                { cmd: '/status', desc: 'Статус системы' },
                { cmd: '/add [тема]', desc: 'Добавить тему в план' },
                { cmd: '/generate [тема]', desc: 'Сгенерировать статью' },
                { cmd: '/stats', desc: 'Статистика публикаций' },
                { cmd: '/help', desc: 'Справка по командам' },
              ].map((item, i) => (
                <div key={i} className="p-2 rounded bg-gray-700/30">
                  <code className="text-blue-400 text-sm">{item.cmd}</code>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400" />
              Уведомления
            </h3>
            <p className="text-sm text-gray-400 mb-3">Бот автоматически отправляет:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={14} className="text-green-400" />
                <span className="text-gray-300">Успешная публикация</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-yellow-400" />
                <span className="text-gray-300">Начало генерации</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-red-400 text-xs">✕</span>
                <span className="text-gray-300">Ошибки и сбои</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-400 text-xs">📊</span>
                <span className="text-gray-300">Ежедневный отчёт</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="font-bold mb-3">Пример уведомления</h3>
            <div className="bg-gray-700/50 rounded-lg p-3 text-sm">
              <p className="text-green-400 font-bold">✅ Статья опубликована!</p>
              <p className="text-gray-300 mt-1">📝 10 способов повысить продуктивность</p>
              <p className="text-blue-400 mt-1 text-xs">🔗 https://dzen.ru/a/...</p>
              <p className="text-gray-500 text-xs mt-2">Время генерации: 47 сек</p>
              <p className="text-gray-500 text-xs">Стоимость: $0.02</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
