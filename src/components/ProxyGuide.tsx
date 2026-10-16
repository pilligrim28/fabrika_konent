import { useState } from 'react';
import { Shield, Globe, Check, Copy, ExternalLink, AlertCircle, Server, Zap } from 'lucide-react';

interface ProxyOption {
  id: string;
  name: string;
  url: string;
  type: string;
  description: string;
  status: 'free' | 'limited' | 'self-hosted';
  instructions: string;
  config: string;
}

export default function ProxyGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const proxyOptions: ProxyOption[] = [
    {
      id: 'ceckin',
      name: 'Ceckin.ru Proxy',
      url: 'https://ceckin.ru/telegram-proxy',
      type: 'HTTP/HTTPS',
      description: 'Бесплатный публичный прокси для Telegram Bot API',
      status: 'free',
      instructions: 'Просто используйте в конфиге',
      config: `telegram:
  bot_token: "YOUR_TOKEN"
  admin_chat_id: 123456789
  proxy: "https://proxy.ceckin.ru/telegram"`
    },
    {
      id: 'telegram-webhook',
      name: 'Telegram Webhook Proxy',
      url: 'https://github.com/telegram-bot-api/proxy',
      type: 'Reverse Proxy',
      description: 'Свой прокси-сервер на VPS',
      status: 'self-hosted',
      instructions: 'Установите на VPS (от $2/мес)',
      config: `telegram:
  bot_token: "YOUR_TOKEN"
  admin_chat_id: 123456789
  proxy: "https://your-vps.com/proxy"`
    },
    {
      id: 'mtproxy',
      name: 'MTProto Proxy',
      url: 'https://github.com/telegramm/MTProxy',
      type: 'MTProto',
      description: 'Официальный Telegram прокси',
      status: 'self-hosted',
      instructions: 'Docker контейнер на VPS',
      config: `telegram:
  bot_token: "YOUR_TOKEN"
  admin_chat_id: 123456789
  mtproxy:
    server: "your-vps.com"
    port: 443
    secret: "YOUR_SECRET"`
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare Workers',
      url: 'https://workers.cloudflare.com',
      type: 'Reverse Proxy',
      description: 'Бесплатный прокси через Cloudflare (100k запросов/день)',
      status: 'free',
      instructions: 'Создайте Worker с кодом ниже',
      config: `telegram:
  bot_token: "YOUR_TOKEN"
  admin_chat_id: 123456789
  proxy: "https://your-worker.workers.dev"`
    }
  ];

  const cloudflareWorkerCode = `// Cloudflare Worker для проксирования Telegram Bot API
// Создать: https://dash.cloudflare.com → Workers → Create

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Перенаправляем на api.telegram.org
    const targetUrl = \`https://api.telegram.org\${url.pathname}\`;
    
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    // Добавляем CORS заголовки
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return newResponse;
  }
}`;

  const nginxProxyConfig = `# Nginx конфигурация для Telegram прокси
# Установить на VPS

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass https://api.telegram.org;
        proxy_set_header Host api.telegram.org;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_ssl_server_name on;
    }
}`;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Прокси для Telegram бота</h1>
        <p className="text-gray-400 mt-1">Бесплатные решения для обхода блокировок Telegram API</p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-yellow-400">Важно</p>
            <p className="text-sm text-gray-300 mt-1">
              Telegram Bot API может быть заблокирован в вашем регионе. Используйте прокси для стабильной работы бота.
            </p>
          </div>
        </div>
      </div>

      {/* Proxy Options */}
      <div className="space-y-6">
        {proxyOptions.map((proxy) => (
          <div key={proxy.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={18} className="text-blue-400" />
                    <h3 className="font-bold text-lg">{proxy.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      proxy.status === 'free' ? 'bg-green-500/20 text-green-400' :
                      proxy.status === 'limited' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {proxy.status === 'free' ? 'Бесплатно' :
                       proxy.status === 'limited' ? 'Ограниченно' : 'Свой сервер'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{proxy.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Тип: {proxy.type}</p>
                </div>
                <a
                  href={proxy.url}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs transition-all"
                >
                  <ExternalLink size={12} />
                  Подробнее
                </a>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm text-gray-400 mb-3">{proxy.instructions}</p>
              <div className="relative">
                <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <code className="text-gray-300 whitespace-pre">{proxy.config}</code>
                </pre>
                <button
                  onClick={() => handleCopy(proxy.config, proxy.id)}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all"
                >
                  {copied === proxy.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied === proxy.id ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cloudflare Worker */}
      <div className="mt-8 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl p-6 border border-orange-500/30">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap size={20} className="text-orange-400" />
          Cloudflare Worker (рекомендуется)
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Бесплатный прокси через Cloudflare Workers. 100,000 запросов в день бесплатно.
        </p>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold text-gray-300 mb-2">1. Создайте Worker:</p>
            <ol className="text-sm text-gray-400 space-y-1 ml-4 list-decimal">
              <li>Зайдите на <a href="https://dash.cloudflare.com" target="_blank" className="text-blue-400">dash.cloudflare.com</a></li>
              <li>Workers & Pages → Create → Create Worker</li>
              <li>Вставьте код ниже</li>
              <li>Deploy</li>
              <li>Скопируйте URL вашего Worker</li>
            </ol>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-300 mb-2">2. Код Worker:</p>
            <div className="relative">
              <pre className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <code className="text-orange-400 whitespace-pre">{cloudflareWorkerCode}</code>
              </pre>
              <button
                onClick={() => handleCopy(cloudflareWorkerCode, 'cf-worker')}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all"
              >
                {copied === 'cf-worker' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied === 'cf-worker' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-300 mb-2">3. Используйте в конфиге:</p>
            <div className="relative">
              <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                <code className="text-gray-300 whitespace-pre">{`telegram:
  bot_token: "YOUR_TOKEN"
  admin_chat_id: 123456789
  proxy: "https://your-worker-name.your-subdomain.workers.dev"`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Self-hosted Nginx */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Server size={20} className="text-purple-400" />
          Свой прокси на VPS (Nginx)
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Если есть VPS (от $2/мес), можно настроить свой прокси через Nginx.
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold text-gray-300 mb-2">Nginx конфигурация:</p>
            <div className="relative">
              <pre className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <code className="text-purple-400 whitespace-pre">{nginxProxyConfig}</code>
              </pre>
              <button
                onClick={() => handleCopy(nginxProxyConfig, 'nginx')}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all"
              >
                {copied === 'nginx' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied === 'nginx' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-300 mb-2">Команды установки:</p>
            <div className="relative">
              <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                <code className="text-green-400 whitespace-pre">{`# Установка Nginx и Certbot
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com

# Перезапуск Nginx
sudo systemctl restart nginx`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Go Code Update */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Обновление Go кода для прокси</h2>
        <p className="text-sm text-gray-400 mb-4">
          Добавьте поддержку прокси в <code className="bg-gray-700 px-2 py-0.5 rounded">internal/bot/bot.go</code>:
        </p>

        <div className="relative">
          <pre className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">
            <code className="text-blue-400 whitespace-pre">{`func New(cfg *config.Config, db *storage.Storage) *Bot {
    // Настройка HTTP клиента с прокси
    var httpClient *http.Client
    
    if cfg.Telegram.Proxy != "" {
        proxyURL, err := url.Parse(cfg.Telegram.Proxy)
        if err != nil {
            log.Fatalf("Ошибка парсинга прокси: %v", err)
        }
        
        httpClient = &http.Client{
            Transport: &http.Transport{
                Proxy: http.ProxyURL(proxyURL),
            },
            Timeout: 60 * time.Second,
        }
        log.Printf("🌐 Используем прокси: %s", cfg.Telegram.Proxy)
    } else {
        httpClient = &http.Client{Timeout: 60 * time.Second}
    }

    // Создаем бота с кастомным HTTP клиентом
    api, err := tgbotapi.NewBotAPIWithClient(
        cfg.Telegram.BotToken,
        tgbotapi.APIEndpoint,
        httpClient,
    )
    if err != nil {
        log.Fatalf("Ошибка инициализации бота: %v", err)
    }
    
    // ... остальной код
}`}</code>
          </pre>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Shield size={20} className="text-green-400" />
          Итого: Полностью бесплатная система
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-bold text-green-400 mb-2">✅ Бесплатно:</p>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Ollama / Groq / Gemini — текст</li>
              <li>• Pollinations.ai — картинки</li>
              <li>• Cloudflare Workers — прокси</li>
              <li>• Telegram Bot API</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-green-400 mb-2">💰 Стоимость:</p>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• AI генерация: $0.00</li>
              <li>• Прокси: $0.00</li>
              <li>• Хостинг: $0.00 (локально)</li>
              <li>• <strong>Итого: $0.00/мес</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
