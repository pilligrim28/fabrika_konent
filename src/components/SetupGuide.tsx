import { CheckCircle, ExternalLink, Terminal, Key, Globe, Bot } from 'lucide-react';

export default function SetupGuide() {
  const steps = [
    {
      icon: <Key size={24} />,
      title: '1. Получите API ключи',
      items: [
        { label: 'OpenAI API', desc: 'platform.openai.com — получите API ключ для GPT-4o-mini (~$0.15/1M токенов)', link: 'https://platform.openai.com' },
        { label: 'Flux API (BFL)', desc: 'api.bfl.ml — недорогая генерация картинок (~$0.03/картинка)', link: 'https://api.bfl.ml' },
        { label: 'Kandinsky (бесплатно)', desc: 'Сбер AI — бесплатная генерация картинок', link: 'https://developers.sber.ru' },
        { label: 'Telegram Bot', desc: 'BotFather в Telegram — создайте бота и получите токен', link: 'https://t.me/BotFather' },
        { label: 'Яндекс Дзен', desc: 'Получите OAuth токен для API Дзен', link: 'https://dzen.ru' },
      ]
    },
    {
      icon: <Terminal size={24} />,
      title: '2. Установка и запуск',
      items: [
        { label: 'Go 1.21+', desc: 'Установите Go с официального сайта', link: 'https://go.dev/dl' },
        { label: 'SQLite', desc: 'Встроенная БД (не требует отдельной установки)', link: null },
        { label: 'Git clone', desc: 'git clone github.com/yourname/content-factory', link: null },
        { label: 'go mod download', desc: 'Установите зависимости', link: null },
        { label: 'go run cmd/main.go', desc: 'Запустите приложение', link: null },
      ]
    },
    {
      icon: <Globe size={24} />,
      title: '3. Настройка конфигурации',
      items: [
        { label: 'configs/config.yaml', desc: 'Заполните все API ключи и настройки', link: null },
        { label: 'Расписание', desc: 'Настройте cron-расписание публикаций', link: null },
        { label: 'Темы', desc: 'Укажите тематики для генерации контента', link: null },
        { label: 'Telegram', desc: 'Укажите bot_token и admin_chat_id', link: null },
      ]
    },
    {
      icon: <Bot size={24} />,
      title: '4. Docker (опционально)',
      items: [
        { label: 'docker build', desc: 'docker build -t content-factory .', link: null },
        { label: 'docker run', desc: 'docker run -d --name cf content-factory', link: null },
        { label: 'docker-compose', desc: 'Или используйте docker-compose up -d', link: null },
      ]
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Руководство по настройке</h1>
        <p className="text-gray-400 mt-1">Пошаговая инструкция по развёртыванию контент-фабрики</p>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30 mb-8">
        <h2 className="text-xl font-bold mb-3">Быстрый старт</h2>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-1">
          <p className="text-gray-500"># Клонирование и установка</p>
          <p className="text-green-400">git clone https://github.com/yourname/content-factory</p>
          <p className="text-green-400">cd content-factory</p>
          <p className="text-green-400">go mod download</p>
          <p className="text-gray-500 mt-2"># Настройка конфига</p>
          <p className="text-green-400">cp configs/config.yaml.example configs/config.yaml</p>
          <p className="text-green-400">nano configs/config.yaml  # Заполните API ключи</p>
          <p className="text-gray-500 mt-2"># Запуск</p>
          <p className="text-green-400">go run cmd/main.go</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
                {step.icon}
              </div>
              <h2 className="text-xl font-bold">{step.title}</h2>
            </div>
            <div className="space-y-3">
              {step.items.map((item, j) => (
                <div key={j} className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/30">
                  <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{item.label}</p>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener" className="text-blue-400 hover:text-blue-300">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Environment Variables */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Переменные окружения</h2>
        <p className="text-sm text-gray-400 mb-4">Вместо config.yaml можно использовать переменные окружения:</p>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-1">
          <p className="text-purple-400">export TELEGRAM_BOT_TOKEN="your_bot_token"</p>
          <p className="text-purple-400">export TELEGRAM_ADMIN_CHAT_ID="123456789"</p>
          <p className="text-purple-400">export OPENAI_API_KEY="sk-..."</p>
          <p className="text-purple-400">export FLUX_API_KEY="your_flux_key"</p>
          <p className="text-purple-400">export DZEN_OAUTH_TOKEN="your_yandex_token"</p>
          <p className="text-purple-400">export DZEN_CHANNEL_ID="your_channel_id"</p>
        </div>
      </div>

      {/* Cost Estimation */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Оценка стоимости</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h3 className="font-bold text-green-400">Экономный режим</h3>
            <p className="text-2xl font-bold mt-2">~$3/мес</p>
            <ul className="text-xs text-gray-400 mt-2 space-y-1">
              <li>• 3 статьи/день</li>
              <li>• GPT-4o-mini (текст)</li>
              <li>• Kandinsky (бесплатно)</li>
              <li>• Ollama локально (опционально)</li>
            </ul>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="font-bold text-blue-400">Стандарт</h3>
            <p className="text-2xl font-bold mt-2">~$8/мес</p>
            <ul className="text-xs text-gray-400 mt-2 space-y-1">
              <li>• 5 статей/день</li>
              <li>• GPT-4o-mini (текст)</li>
              <li>• Flux Pro (картинки)</li>
              <li>• Telegram уведомления</li>
            </ul>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h3 className="font-bold text-purple-400">Максимум</h3>
            <p className="text-2xl font-bold mt-2">~$20/мес</p>
            <ul className="text-xs text-gray-400 mt-2 space-y-1">
              <li>• 10 статей/день</li>
              <li>• GPT-4o-mini (текст)</li>
              <li>• Flux Pro (картинки)</li>
              <li>• Несколько каналов</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
