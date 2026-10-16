import { ExternalLink, Shield, AlertCircle, CheckCircle, Globe, Server, Wifi } from 'lucide-react';

export default function ProxyGuide() {
  const freeProxies = [
    {
      name: 'Free Proxy List',
      url: 'https://free-proxy-list.net',
      type: 'HTTP/HTTPS',
      status: 'Нестабильные',
      desc: 'Список публичных прокси. Могут быть медленными и недоступными.',
      color: 'yellow'
    },
    {
      name: 'ProxyScrape',
      url: 'https://proxyscrape.com/free-proxy-list',
      type: 'HTTP/SOCKS',
      status: 'Нестабильные',
      desc: 'Бесплатные прокси разных типов. Качество varies.',
      color: 'yellow'
    },
    {
      name: 'GeoNode',
      url: 'https://geonode.com/free-proxy-list',
      type: 'HTTP/HTTPS',
      status: 'Нестабильные',
      desc: 'Бесплатный список прокси. Обновляется регулярно.',
      color: 'yellow'
    },
    {
      name: 'Свой VPS (рекомендуется)',
      url: 'https://timeweb.cloud',
      type: 'HTTP/SOCKS',
      status: 'Стабильный',
      desc: 'Арендуйте VPS за ~$2/мес и настройте свой прокси. Самый надёжный вариант.',
      color: 'green'
    },
    {
      name: 'MTProto Proxy',
      url: 'https://github.com/telegramm/MTProxy',
      type: 'MTProto',
      status: 'Стабильный',
      desc: 'Официальный прокси от Telegram. Нужно настроить свой сервер.',
      color: 'blue'
    }
  ];

  const setupMethods = [
    {
      title: 'Метод 1: HTTP прокси в конфиге',
      code: `# configs/config.yaml
proxy:
  enabled: true
  url: "http://proxy.example.com:8080"`,
      desc: 'Простой способ. Укажите прокси в конфиге.'
    },
    {
      title: 'Метод 2: Переменная окружения',
      code: `# Linux/Mac
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080

# Windows (PowerShell)
$env:HTTP_PROXY="http://proxy.example.com:8080"
$env:HTTPS_PROXY="http://proxy.example.com:8080"

# Затем запустите
go run cmd/main.go`,
      desc: 'Go автоматически использует HTTP_PROXY переменные.'
    },
    {
      title: 'Метод 3: SOCKS5 прокси',
      code: `# configs/config.yaml
proxy:
  enabled: true
  url: "socks5://user:pass@proxy.example.com:1080"`,
      desc: 'SOCKS5 прокси с авторизацией.'
    },
    {
      title: 'Метод 4: Docker с прокси',
      code: `# docker-compose.yml
services:
  content-factory:
    environment:
      - HTTP_PROXY=http://proxy:8080
      - HTTPS_PROXY=http://proxy:8080
    # Или используйте network_mode: host`,
      desc: 'Для Docker контейнеров.'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Прокси для Telegram бота</h1>
        <p className="text-gray-400 mt-1">Если Telegram заблокирован в вашем регионе</p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-yellow-400">Важно о бесплатных прокси</p>
            <p className="text-sm text-gray-300 mt-1">
              Бесплатные публичные прокси часто нестабильны, медленны и могут быть недоступны. 
              Для продакшена рекомендуется использовать свой VPS с прокси (~$2/мес) или платные прокси-сервисы.
            </p>
          </div>
        </div>
      </div>

      {/* Free Proxies List */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Globe size={20} className="text-blue-400" />
          Бесплатные прокси-сервисы
        </h2>
        <div className="space-y-3">
          {freeProxies.map((proxy, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
              <div className={`w-2 h-2 rounded-full bg-${proxy.color}-500 mt-2 flex-shrink-0`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm">{proxy.name}</h3>
                  <span className={`px-2 py-0.5 bg-${proxy.color}-500/20 text-${proxy.color}-400 text-xs rounded`}>
                    {proxy.status}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-600/50 text-gray-300 text-xs rounded">
                    {proxy.type}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{proxy.desc}</p>
                <a
                  href={proxy.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300"
                >
                  <ExternalLink size={12} />
                  Перейти
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Methods */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Server size={20} className="text-purple-400" />
          Способы настройки прокси
        </h2>
        <div className="space-y-4">
          {setupMethods.map((method, i) => (
            <div key={i} className="border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-3 bg-gray-700/50 border-b border-gray-700">
                <h3 className="font-bold text-sm">{method.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{method.desc}</p>
              </div>
              <pre className="p-4 bg-gray-900 text-sm font-mono overflow-x-auto">
                <code className="text-green-400">{method.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* VPS Recommendation */}
      <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-xl p-6 border border-green-500/30">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-400" />
          Рекомендуемый вариант: Свой VPS
        </h2>
        <p className="text-sm text-gray-300 mb-4">
          Самый надёжный способ — арендовать VPS и настроить свой прокси. Это стоит ~$2/мес и гарантирует стабильную работу.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-sm mb-2">VPS провайдеры:</h3>
            <div className="space-y-2">
              <a href="https://timeweb.cloud" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                <ExternalLink size={12} /> TimeWeb (~150₽/мес)
              </a>
              <a href="https://firstvds.ru" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                <ExternalLink size={12} /> FirstVDS (~200₽/мес)
              </a>
              <a href="https://digitalocean.com" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                <ExternalLink size={12} /> DigitalOcean ($4/мес)
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2">Настройка Squid прокси:</h3>
            <pre className="bg-gray-900 rounded-lg p-3 text-xs font-mono overflow-x-auto">
              <code className="text-green-400">{`# На VPS (Ubuntu/Debian)
sudo apt update
sudo apt install squid

# Настроить /etc/squid/squid.conf
# Запустить
sudo systemctl start squid
sudo systemctl enable squid

# Прокси будет на порту 3128`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Testing */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Wifi size={20} className="text-cyan-400" />
          Проверка прокси
        </h2>
        <p className="text-sm text-gray-400 mb-3">Проверьте что прокси работает:</p>
        <pre className="bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
          <code className="text-blue-400">{`# Проверка HTTP прокси
curl -x http://proxy.example.com:8080 https://api.telegram.org

# Должен вернуть JSON от Telegram API

# Проверка через Python
python3 -c "
import requests
proxies = {'http': 'http://proxy:8080', 'https': 'http://proxy:8080'}
r = requests.get('https://api.telegram.org/bot<TOKEN>/getMe', proxies=proxies)
print(r.json())
"`}</code>
        </pre>
      </div>

      {/* Config Example */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-3">Пример конфигурации с прокси</h2>
        <pre className="bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
          <code className="text-gray-300">{`# configs/config.yaml

telegram:
  bot_token: "123456:ABC-DEF..."
  admin_chat_id: 123456789

# Включаем прокси
proxy:
  enabled: true
  url: "http://your-proxy:8080"
  # Или для SOCKS5:
  # url: "socks5://user:pass@proxy:1080"

text:
  provider: "ollama"
  ollama:
    url: "http://localhost:11434"
    model: "llama3.1"

image:
  provider: "pollinations"

# ... остальная конфигурация`}</code>
        </pre>
      </div>
    </div>
  );
}
