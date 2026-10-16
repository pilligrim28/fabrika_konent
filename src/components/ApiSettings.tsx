import { useState } from 'react';
import { Key, ExternalLink, Check, AlertCircle, Eye, EyeOff, Save, Trash2, Plus, Cpu, Image, Bot, Globe, Shield, Zap } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  type: 'text' | 'image' | 'telegram' | 'dzen';
  status: 'active' | 'inactive' | 'error';
  url: string;
  description: string;
  freeLimit: string;
}

export default function ApiSettings() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Groq API',
      key: '',
      provider: 'groq',
      type: 'text',
      status: 'inactive',
      url: 'https://console.groq.com/keys',
      description: 'Бесплатный API с Llama 3.1. 14400 запросов/день.',
      freeLimit: '14400 запросов/день',
    },
    {
      id: '2',
      name: 'Google Gemini',
      key: '',
      provider: 'gemini',
      type: 'text',
      status: 'inactive',
      url: 'https://aistudio.google.com/app/apikey',
      description: 'Бесплатный тариф Google. Gemini 1.5 Flash.',
      freeLimit: '1500 запросов/день',
    },
    {
      id: '3',
      name: 'HuggingFace Token',
      key: '',
      provider: 'huggingface',
      type: 'text',
      status: 'inactive',
      url: 'https://huggingface.co/settings/tokens',
      description: 'Доступ к Mistral, Llama, Qwen и другим моделям.',
      freeLimit: 'Бесплатный лимит',
    },
    {
      id: '4',
      name: 'Ollama (локально)',
      key: 'http://localhost:11434',
      provider: 'ollama',
      type: 'text',
      status: 'active',
      url: 'https://ollama.com',
      description: 'Локальная генерация. Без API ключа! Нужна установка.',
      freeLimit: 'Безлимитно',
    },
    {
      id: '5',
      name: 'Pollinations.ai',
      key: 'Не требуется',
      provider: 'pollinations',
      type: 'image',
      status: 'active',
      url: 'https://pollinations.ai',
      description: 'Бесплатная генерация картинок. Без ключа!',
      freeLimit: 'Безлимитно',
    },
    {
      id: '6',
      name: 'Kandinsky (Сбер)',
      key: '',
      provider: 'kandinsky',
      type: 'image',
      status: 'inactive',
      url: 'https://developers.sber.ru/studio/workspaces',
      description: 'Российская нейросеть. 1000 генераций/мес бесплатно.',
      freeLimit: '1000 генераций/мес',
    },
    {
      id: '7',
      name: 'HF Images (SD)',
      key: '',
      provider: 'huggingface_img',
      type: 'image',
      status: 'inactive',
      url: 'https://huggingface.co/settings/tokens',
      description: 'Stable Diffusion через HuggingFace. Тот же токен.',
      freeLimit: 'Бесплатный лимит',
    },
    {
      id: '8',
      name: 'Telegram Bot Token',
      key: '',
      provider: 'telegram',
      type: 'telegram',
      status: 'inactive',
      url: 'https://t.me/BotFather',
      description: 'Токен Telegram бота для управления и уведомлений.',
      freeLimit: 'Бесплатно',
    },
    {
      id: '9',
      name: 'Яндекс Дзен OAuth',
      key: '',
      provider: 'dzen',
      type: 'dzen',
      status: 'inactive',
      url: 'https://dzen.ru',
      description: 'OAuth токен для публикации статей в Яндекс Дзен.',
      freeLimit: 'Бесплатно',
    },
  ]);

  const [newKey, setNewKey] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateKey = (id: string, value: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, key: value, status: value ? 'active' : 'inactive' } : k));
    setEditingId(null);
  };

  const maskKey = (key: string) => {
    if (!key || key === 'Не требуется' || key.startsWith('http')) return key;
    if (key.length <= 8) return '••••••••';
    return key.slice(0, 4) + '••••••••' + key.slice(-4);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Cpu size={16} className="text-blue-400" />;
      case 'image': return <Image size={16} className="text-purple-400" />;
      case 'telegram': return <Bot size={16} className="text-cyan-400" />;
      case 'dzen': return <Globe size={16} className="text-red-400" />;
      default: return <Key size={16} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1"><Check size={10} /> Активен</span>;
      case 'inactive': return <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">Не настроен</span>;
      case 'error': return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1"><AlertCircle size={10} /> Ошибка</span>;
      default: return null;
    }
  };

  const activeCount = keys.filter(k => k.status === 'active').length;
  const totalCount = keys.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Настройка API ключей</h1>
        <p className="text-gray-400 mt-1">Добавьте ключи для бесплатных AI сервисов. Все ссылки для получения — ниже.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Shield size={18} />
            <span className="text-sm font-medium">Бесплатно</span>
          </div>
          <p className="text-2xl font-bold">$0.00</p>
          <p className="text-xs text-gray-500">Стоимость в месяц</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Check size={18} />
            <span className="text-sm font-medium">Подключено</span>
          </div>
          <p className="text-2xl font-bold">{activeCount}/{totalCount}</p>
          <p className="text-xs text-gray-500">API ключей</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Zap size={18} />
            <span className="text-sm font-medium">Минимум нужно</span>
          </div>
          <p className="text-2xl font-bold">2</p>
          <p className="text-xs text-gray-500">Текст + Картинки</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Cpu size={18} />
            <span className="text-sm font-medium">Рекомендация</span>
          </div>
          <p className="text-lg font-bold">Ollama + Pollinations</p>
          <p className="text-xs text-gray-500">Без ключей вообще</p>
        </div>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {/* Text Providers */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center gap-2">
            <Cpu size={18} className="text-blue-400" />
            <h2 className="font-bold">Провайдеры текста</h2>
            <span className="text-xs text-gray-500 ml-2">Выберите один</span>
          </div>
          <div className="divide-y divide-gray-700">
            {keys.filter(k => k.type === 'text').map((apiKey) => (
              <div key={apiKey.id} className="p-4 hover:bg-gray-700/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(apiKey.type)}
                      <h3 className="font-bold text-sm">{apiKey.name}</h3>
                      {getStatusBadge(apiKey.status)}
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">{apiKey.freeLimit}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{apiKey.description}</p>
                    
                    {editingId === apiKey.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={apiKey.key}
                          autoFocus
                          className="flex-1 bg-gray-900 rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          placeholder="Вставьте API ключ..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateKey(apiKey.id, (e.target as HTMLInputElement).value);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button onClick={() => updateKey(apiKey.id, (document.querySelector('input[autoFocus]') as HTMLInputElement)?.value || '')} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                          <Save size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-gray-400 bg-gray-900 px-2 py-1 rounded font-mono">
                          {showKeys[apiKey.id] ? (apiKey.key || '—') : maskKey(apiKey.key)}
                        </code>
                        {apiKey.key && apiKey.key !== 'Не требуется' && !apiKey.key.startsWith('http') && (
                          <button onClick={() => toggleShowKey(apiKey.id)} className="text-gray-500 hover:text-gray-300">
                            {showKeys[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        )}
                        <button onClick={() => setEditingId(apiKey.id)} className="text-xs text-blue-400 hover:text-blue-300">
                          {apiKey.key ? 'Изменить' : 'Добавить ключ'}
                        </button>
                      </div>
                    )}
                  </div>
                  <a href={apiKey.url} target="_blank" rel="noopener" className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs transition-all whitespace-nowrap">
                    <Key size={12} /> Получить
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Providers */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center gap-2">
            <Image size={18} className="text-purple-400" />
            <h2 className="font-bold">Провайдеры картинок</h2>
            <span className="text-xs text-gray-500 ml-2">Выберите один</span>
          </div>
          <div className="divide-y divide-gray-700">
            {keys.filter(k => k.type === 'image').map((apiKey) => (
              <div key={apiKey.id} className="p-4 hover:bg-gray-700/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(apiKey.type)}
                      <h3 className="font-bold text-sm">{apiKey.name}</h3>
                      {getStatusBadge(apiKey.status)}
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">{apiKey.freeLimit}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{apiKey.description}</p>
                    
                    {editingId === apiKey.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={apiKey.key}
                          autoFocus
                          className="flex-1 bg-gray-900 rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          placeholder="Вставьте API ключ..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateKey(apiKey.id, (e.target as HTMLInputElement).value);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button onClick={() => updateKey(apiKey.id, (document.querySelector('input[autoFocus]') as HTMLInputElement)?.value || '')} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                          <Save size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-gray-400 bg-gray-900 px-2 py-1 rounded font-mono">
                          {showKeys[apiKey.id] ? (apiKey.key || '—') : maskKey(apiKey.key)}
                        </code>
                        {apiKey.key && apiKey.key !== 'Не требуется' && !apiKey.key.startsWith('http') && (
                          <button onClick={() => toggleShowKey(apiKey.id)} className="text-gray-500 hover:text-gray-300">
                            {showKeys[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        )}
                        <button onClick={() => setEditingId(apiKey.id)} className="text-xs text-blue-400 hover:text-blue-300">
                          {apiKey.key ? 'Изменить' : 'Добавить ключ'}
                        </button>
                      </div>
                    )}
                  </div>
                  <a href={apiKey.url} target="_blank" rel="noopener" className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs transition-all whitespace-nowrap">
                    <Key size={12} /> Получить
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telegram & Dzen */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center gap-2">
            <Bot size={18} className="text-cyan-400" />
            <h2 className="font-bold">Сервисы (Telegram + Дзен)</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {keys.filter(k => k.type === 'telegram' || k.type === 'dzen').map((apiKey) => (
              <div key={apiKey.id} className="p-4 hover:bg-gray-700/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(apiKey.type)}
                      <h3 className="font-bold text-sm">{apiKey.name}</h3>
                      {getStatusBadge(apiKey.status)}
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">{apiKey.freeLimit}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{apiKey.description}</p>
                    
                    {editingId === apiKey.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={apiKey.key}
                          autoFocus
                          className="flex-1 bg-gray-900 rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          placeholder="Вставьте токен..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateKey(apiKey.id, (e.target as HTMLInputElement).value);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button onClick={() => updateKey(apiKey.id, (document.querySelector('input[autoFocus]') as HTMLInputElement)?.value || '')} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                          <Save size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-gray-400 bg-gray-900 px-2 py-1 rounded font-mono">
                          {showKeys[apiKey.id] ? (apiKey.key || '—') : maskKey(apiKey.key)}
                        </code>
                        {apiKey.key && (
                          <button onClick={() => toggleShowKey(apiKey.id)} className="text-gray-500 hover:text-gray-300">
                            {showKeys[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        )}
                        <button onClick={() => setEditingId(apiKey.id)} className="text-xs text-blue-400 hover:text-blue-300">
                          {apiKey.key ? 'Изменить' : 'Добавить токен'}
                        </button>
                      </div>
                    )}
                  </div>
                  <a href={apiKey.url} target="_blank" rel="noopener" className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs transition-all whitespace-nowrap">
                    <Key size={12} /> Получить
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Быстрые ссылки для регистрации</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Ollama', url: 'https://ollama.com', desc: 'Скачать (Linux/Mac/Win)', color: 'green' },
            { name: 'Groq Console', url: 'https://console.groq.com/keys', desc: 'Бесплатный Llama API', color: 'yellow' },
            { name: 'Google AI Studio', url: 'https://aistudio.google.com/app/apikey', desc: 'Gemini API ключ', color: 'red' },
            { name: 'HuggingFace', url: 'https://huggingface.co/settings/tokens', desc: 'Токен для моделей', color: 'orange' },
            { name: 'Pollinations', url: 'https://pollinations.ai', desc: 'Картинки без ключа', color: 'green' },
            { name: 'Сбер AI (Kandinsky)', url: 'https://developers.sber.ru/studio/workspaces', desc: 'Бесплатные картинки', color: 'blue' },
            { name: 'Telegram BotFather', url: 'https://t.me/BotFather', desc: 'Создать бота', color: 'cyan' },
            { name: 'User Info Bot', url: 'https://t.me/userinfobot', desc: 'Узнать свой chat_id', color: 'cyan' },
            { name: 'Яндекс Дзен', url: 'https://dzen.ru', desc: 'OAuth для API', color: 'red' },
          ].map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/60 rounded-lg transition-all group"
            >
              <div className={`w-2 h-2 rounded-full bg-${link.color}-500`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-white transition-colors">{link.name}</p>
                <p className="text-xs text-gray-500 truncate">{link.desc}</p>
              </div>
              <ExternalLink size={14} className="text-gray-600 group-hover:text-gray-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Config Preview */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Сгенерированный config.yaml</h2>
        <p className="text-sm text-gray-400 mb-3">На основе ваших настроек:</p>
        <pre className="bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
          <code className="text-gray-300">{`telegram:
  bot_token: "${keys.find(k => k.type === 'telegram')?.key || 'YOUR_TOKEN'}"
  admin_chat_id: YOUR_CHAT_ID

text:
  provider: "${keys.find(k => k.type === 'text' && k.status === 'active')?.provider || 'ollama'}"
  ${keys.find(k => k.provider === 'ollama')?.status === 'active' ? `ollama:
    url: "http://localhost:11434"
    model: "llama3.1"` : ''}
  ${keys.find(k => k.provider === 'groq')?.status === 'active' ? `groq:
    api_key: "${keys.find(k => k.provider === 'groq')?.key || ''}"
    model: "llama-3.1-8b-instant"` : ''}

image:
  provider: "${keys.find(k => k.type === 'image' && k.status === 'active')?.provider || 'pollinations'}"
  output_dir: "./data/images"

dzen:
  oauth_token: "${keys.find(k => k.type === 'dzen')?.key || 'YOUR_TOKEN'}"
  channel_id: "YOUR_CHANNEL_ID"`}</code>
        </pre>
      </div>
    </div>
  );
}
