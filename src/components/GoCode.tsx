import { useState, useEffect } from 'react';
import { Copy, Check, FileCode, Download, FolderOpen } from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  code: string;
}

const FILES_TO_LOAD = [
  { name: 'README.md', path: '/go-source/README.md' },
  { name: 'go.mod', path: '/go-source/go.mod' },
  { name: 'config.yaml', path: '/go-source/configs/config.yaml' },
  { name: 'main.go', path: '/go-source/cmd/main.go' },
  { name: 'config.go', path: '/go-source/internal/config/config.go' },
  { name: 'models.go', path: '/go-source/internal/models/models.go' },
  { name: 'storage.go', path: '/go-source/internal/storage/storage.go' },
  { name: 'provider.go', path: '/go-source/internal/ai/provider.go' },
  { name: 'ollama.go', path: '/go-source/internal/ai/ollama.go' },
  { name: 'groq.go', path: '/go-source/internal/ai/groq.go' },
  { name: 'gemini.go', path: '/go-source/internal/ai/gemini.go' },
  { name: 'huggingface_text.go', path: '/go-source/internal/ai/huggingface_text.go' },
  { name: 'image_pollinations.go', path: '/go-source/internal/ai/image_pollinations.go' },
  { name: 'image_kandinsky.go', path: '/go-source/internal/ai/image_kandinsky.go' },
  { name: 'image_huggingface.go', path: '/go-source/internal/ai/image_huggingface.go' },
  { name: 'scheduler.go', path: '/go-source/internal/scheduler/scheduler.go' },
  { name: 'bot.go', path: '/go-source/internal/bot/bot.go' },
  { name: 'dzen.go', path: '/go-source/internal/dzen/dzen.go' },
  { name: 'Dockerfile', path: '/go-source/Dockerfile' },
  { name: 'docker-compose.yml', path: '/go-source/docker-compose.yml' },
];

export default function GoCode() {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      const loaded: CodeFile[] = [];
      for (const f of FILES_TO_LOAD) {
        try {
          const resp = await fetch(f.path);
          const text = await resp.text();
          loaded.push({ name: f.name, path: f.path.replace('/go-source/', ''), code: text });
        } catch {
          loaded.push({ name: f.name, path: f.path.replace('/go-source/', ''), code: '// Файл не найден' });
        }
      }
      setFiles(loaded);
      setLoading(false);
    };
    loadFiles();
  }, []);

  const handleCopy = () => {
    if (files[activeFile]) {
      navigator.clipboard.writeText(files[activeFile].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadAll = () => {
    // Создаём ссылку на скачивание ZIP (через JSZip в будущем)
    // Пока просто скачиваем текущий файл
    if (files[activeFile]) {
      const blob = new Blob([files[activeFile].code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = files[activeFile].name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка файлов проекта...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Исходный код проекта</h1>
            <p className="text-gray-400 mt-1">
              Реальные Go файлы — {files.length} файлов. Скопируйте или скачайте.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-all"
            >
              <Download size={16} />
              Скачать файл
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            💰 $0.00/мес
          </span>
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm">
            📦 {files.length} файлов
          </span>
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm">
            🆓 Бесплатные AI
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* File List */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-3 border-b border-gray-700 flex items-center gap-2">
              <FolderOpen size={16} className="text-yellow-400" />
              <p className="text-sm font-bold text-gray-300">content-factory/</p>
            </div>
            <div className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
              {files.map((file, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFile(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeFile === i
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode size={14} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 pl-5 truncate">{file.path}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h3 className="text-sm font-bold mb-2">Быстрый старт</h3>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-1">
              <p className="text-green-400">go mod download</p>
              <p className="text-green-400">go run cmd/main.go</p>
            </div>
          </div>
        </div>

        {/* Code Display */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-400">{files[activeFile]?.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {files[activeFile]?.code.split('\n').length} строк
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs transition-all"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed max-h-[600px] overflow-y-auto">
              <code className="text-gray-300 font-mono whitespace-pre">{files[activeFile]?.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
