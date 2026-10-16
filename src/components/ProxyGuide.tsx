import { useState } from 'react';
import { Shield, ExternalLink, Copy, Check, Server, Globe, Lock, Zap, AlertCircle } from 'lucide-react';

export default function ProxyGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Бесплатные прокси для Telegram</h1>
        <p className="text-gray-400 mt-1">Если Telegram API заблокирован в вашем регионе</p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-200 font-medium">Когда нужен прокси?</p>
          <p className="text-xs text-gray-400 mt-1">Если вы получаете ошибку подключения к Telegram API или бот не запускается</p>
        </div>
      </div>

      {/* Proxy Options */}
      <div className="space-y-6">
        {/* Option 1: Public MTProto */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">1. Публичные MTProto прокси</h2>
              <p className="text-sm text-gray-400">Бесплатные прокси от сообщества</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Globe size={16} className="text-blue-400" />
                Где найти бесплатные прокси:
              </h3>
              <div className="space-y-2">
                <a href="https://t.me/MTProxybot" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> @MTProxybot — официальный бот Telegram
                </a>
                <a href="https://t.me/proxy_list" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> @proxy_list — список публичных прокси
                </a>
                <a href="https://t.me/MTProxyTOP" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> @MTProxyTOP — топ рабочих прокси
                </a>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Пример конфигурации:</p>
              <pre className="font-mono text-sm overflow-x-auto">
                <code className="text-gray-300">{`telegram:
  proxy:
    enabled: true
    type: "socks5"  # MTProto конвертируется в SOCKS5
    socks5:
      host: "proxy.example.com"
      port: 1080
      username: ""
      password: ""`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Option 2: Free SOCKS5 */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600/20 text-green-400 rounded-lg flex items-center justify-center">
              <Server size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">2. Бесплатные SOCKS5 прокси</h2>
              <p className="text-sm text-gray-400">Публичные списки прокси</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2">Источники бесплатных прокси:</h3>
              <div className="space-y-2">
                <a href="https://www.sslproxies.org/" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> sslproxies.org — SSL прокси
                </a>
                <a href="https://free-proxy-list.net/" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> free-proxy-list.net — бесплатные прокси
                </a>
                <a href="https://www.proxyscan.io/" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> proxyscan.io — сканер прокси
                </a>
                <a href="https://github.com/TheSpeedX/PROXY-List" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> GitHub PROXY-List — актуальные списки
                </a>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Пример конфигурации:</p>
              <pre className="font-mono text-sm overflow-x-auto">
                <code className="text-gray-300">{`telegram:
  proxy:
    enabled: true
    type: "socks5"
    socks5:
      host: "185.100.87.202"  # пример IP
      port: 1080
      username: ""
      password: ""`}</code>
              </pre>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-xs text-yellow-200">
                ⚠️ Бесплатные прокси могут быть нестабильными. Рекомендуется использовать свой сервер.
              </p>
            </div>
          </div>
        </div>

        {/* Option 3: Self-hosted */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-600/20 text-purple-400 rounded-lg flex items-center justify-center">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">3. Свой MTProto прокси (рекомендуется)</h2>
              <p className="text-sm text-gray-400">Бесплатный VPS + официальный прокси</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2">Бесплатные VPS для прокси:</h3>
              <div className="space-y-2">
                <a href="https://www.oracle.com/cloud/free/" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> Oracle Cloud Free Tier — навсегда бесплатно
                </a>
                <a href="https://aws.amazon.com/free/" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> AWS Free Tier — 12 месяцев бесплатно
                </a>
                <a href="https://cloud.google.com/free" target="_blank" rel="noopener" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                  <ExternalLink size={14} /> Google Cloud Free — $300 кредитов
                </a>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Установка MTProto прокси на VPS:</p>
              <div className="relative">
                <pre className="font-mono text-sm overflow-x-auto">
                  <code className="text-green-400">{`# Подключитесь к VPS по SSH
ssh root@your-server-ip

# Установите Docker
curl -fsSL https://get.docker.com | sh

# Запустите MTProto прокси
docker run -d \\
  --name mtproto-proxy \\
  -p 443:443 \\
  telegrammessenger/proxy \\
  -P 443 \\
  -S <secret>

# Получите ссылку на прокси
docker logs mtproto-proxy`}</code>
                </pre>
                <button
                  onClick={() => handleCopy(`# Подключитесь к VPS по SSH
ssh root@your-server-ip

# Установите Docker
curl -fsSL https://get.docker.com | sh

# Запустите MTProto прокси
docker run -d \\
  --name mtproto-proxy \\
  -p 443:443 \\
  telegrammessenger/proxy \\
  -P 443 \\
  -S <secret>

# Получите ссылку на прокси
docker logs mtproto-proxy`, 'mtproto-install')}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all"
                >
                  {copied === 'mtproto-install' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-200">
                💡 MTProto прокси нужно конвертировать в SOCKS5 через <strong>mtg</strong> или <strong>3proxy</strong> для использования в Go
              </p>
            </div>
          </div>
        </div>

        {/* Option 4: Tor */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-lg flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">4. Tor прокси (альтернатива)</h2>
              <p className="text-sm text-gray-400">Анонимность + обход блокировок</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Установка Tor:</p>
              <div className="relative">
                <pre className="font-mono text-sm overflow-x-auto">
                  <code className="text-green-400">{`# Linux
sudo apt install tor

# Запустите Tor
sudo systemctl start tor

# Tor SOCKS5 прокси на порту 9050
# Используйте в конфиге:
telegram:
  proxy:
    enabled: true
    type: "socks5"
    socks5:
      host: "127.0.0.1"
      port: 9050`}</code>
                </pre>
                <button
                  onClick={() => handleCopy(`# Linux
sudo apt install tor

# Запустите Tor
sudo systemctl start tor

# Tor SOCKS5 прокси на порту 9050`, 'tor-install')}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all"
                >
                  {copied === 'tor-install' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Test */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Проверка работы прокси</h2>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
          <p className="text-gray-500"># Проверьте что прокси работает:</p>
          <p className="text-green-400 mt-2">curl -x socks5://proxy-host:port https://api.telegram.org</p>
          <p className="text-gray-500 mt-3"># Или через Python:</p>
          <pre className="text-blue-400 mt-1">{`import requests
proxies = {'https': 'socks5://proxy-host:port'}
r = requests.get('https://api.telegram.org/bot<TOKEN>/getMe', proxies=proxies)
print(r.json())`}</pre>
        </div>
      </div>

      {/* Config Example */}
      <div className="mt-6 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-xl p-6 border border-green-500/30">
        <h2 className="text-xl font-bold mb-4">Полный пример config.yaml с прокси</h2>
        <div className="relative">
          <pre className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code className="text-gray-300">{`telegram:
  bot_token: "YOUR_BOT_TOKEN"
  admin_chat_id: 123456789
  
  proxy:
    enabled: true
    type: "socks5"
    socks5:
      host: "your-proxy.com"
      port: 1080
      username: ""
      password: ""

# Остальной конфиг...
text:
  provider: "ollama"
  ollama:
    url: "http://localhost:11434"
    model: "llama3.1"

image:
  provider: "pollinations"
  output_dir: "./data/images"`}</code>
          </pre>
          <button
            onClick={() => handleCopy(`telegram:
  bot_token: "YOUR_BOT_TOKEN"
  admin_chat_id: 123456789
  
  proxy:
    enabled: true
    type: "socks5"
    socks5:
      host: "your-proxy.com"
      port: 1080
      username: ""
      password: ""`, 'config-example')}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-all"
          >
            {copied === 'config-example' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}
