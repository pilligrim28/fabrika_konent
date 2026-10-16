import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Список всех файлов проекта
export const PROJECT_FILES = [
  // Корневые файлы
  { path: 'README.md', url: '/go-source/README.md' },
  { path: 'go.mod', url: '/go-source/go.mod' },
  { path: 'go.sum', url: '/go-source/go.sum' },
  { path: 'Dockerfile', url: '/go-source/Dockerfile' },
  { path: 'docker-compose.yml', url: '/go-source/docker-compose.yml' },
  { path: '.gitignore', url: '/go-source/.gitignore' },
  { path: 'LICENSE', url: '/go-source/LICENSE' },
  { path: 'publish.sh', url: '/go-source/publish.sh' },
  { path: 'PUBLISH_GUIDE.md', url: '/go-source/PUBLISH_GUIDE.md' },
  { path: '.github/workflows/ci.yml', url: '/go-source/.github/workflows/ci.yml' },
  
  // Конфигурация
  { path: 'configs/config.yaml', url: '/go-source/configs/config.yaml' },
  
  // cmd
  { path: 'cmd/main.go', url: '/go-source/cmd/main.go' },
  
  // internal/ai
  { path: 'internal/ai/provider.go', url: '/go-source/internal/ai/provider.go' },
  { path: 'internal/ai/ollama.go', url: '/go-source/internal/ai/ollama.go' },
  { path: 'internal/ai/groq.go', url: '/go-source/internal/ai/groq.go' },
  { path: 'internal/ai/gemini.go', url: '/go-source/internal/ai/gemini.go' },
  { path: 'internal/ai/huggingface_text.go', url: '/go-source/internal/ai/huggingface_text.go' },
  { path: 'internal/ai/image_pollinations.go', url: '/go-source/internal/ai/image_pollinations.go' },
  { path: 'internal/ai/image_kandinsky.go', url: '/go-source/internal/ai/image_kandinsky.go' },
  { path: 'internal/ai/image_huggingface.go', url: '/go-source/internal/ai/image_huggingface.go' },
  
  // internal/bot
  { path: 'internal/bot/bot.go', url: '/go-source/internal/bot/bot.go' },
  
  // internal/config
  { path: 'internal/config/config.go', url: '/go-source/internal/config/config.go' },
  
  // internal/dzen
  { path: 'internal/dzen/dzen.go', url: '/go-source/internal/dzen/dzen.go' },
  
  // internal/models
  { path: 'internal/models/models.go', url: '/go-source/internal/models/models.go' },
  
  // internal/scheduler
  { path: 'internal/scheduler/scheduler.go', url: '/go-source/internal/scheduler/scheduler.go' },
  
  // internal/storage
  { path: 'internal/storage/storage.go', url: '/go-source/internal/storage/storage.go' },
];

export interface DownloadProgress {
  current: number;
  total: number;
  currentFile: string;
  status: 'downloading' | 'creating' | 'complete' | 'error';
}

/**
 * Скачать весь проект как ZIP архив
 */
export async function downloadProject(
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  const zip = new JSZip();
  const total = PROJECT_FILES.length;
  
  try {
    // Загружаем все файлы
    for (let i = 0; i < PROJECT_FILES.length; i++) {
      const file = PROJECT_FILES[i];
      
      onProgress?.({
        current: i + 1,
        total,
        currentFile: file.path,
        status: 'downloading'
      });
      
      try {
        const response = await fetch(file.url);
        if (!response.ok) {
          console.warn(`Не удалось загрузить ${file.path}: ${response.status}`);
          continue;
        }
        
        const content = await response.text();
        zip.file(file.path, content);
      } catch (error) {
        console.warn(`Ошибка загрузки ${file.path}:`, error);
      }
    }
    
    // Создаём ZIP архив
    onProgress?.({
      current: total,
      total,
      currentFile: 'Создание архива...',
      status: 'creating'
    });
    
    const blob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });
    
    // Сохраняем файл
    saveAs(blob, 'content-factory.zip');
    
    onProgress?.({
      current: total,
      total,
      currentFile: 'Завершено',
      status: 'complete'
    });
    
  } catch (error) {
    console.error('Ошибка создания архива:', error);
    onProgress?.({
      current: 0,
      total,
      currentFile: 'Ошибка',
      status: 'error'
    });
    throw error;
  }
}

/**
 * Скачать один файл
 */
export async function downloadFile(path: string, url: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const blob = await response.blob();
    const fileName = path.split('/').pop() || 'file';
    saveAs(blob, fileName);
  } catch (error) {
    console.error(`Ошибка скачивания ${path}:`, error);
    throw error;
  }
}
