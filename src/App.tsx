import { useState } from 'react';
import { Bot, FileText, Calendar, Settings, Code2, LayoutDashboard, BookOpen, Zap } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ContentPlan from './components/ContentPlan';
import Architecture from './components/Architecture';
import GoCode from './components/GoCode';
import SetupGuide from './components/SetupGuide';
import TelegramBot from './components/TelegramBot';

type Tab = 'dashboard' | 'content-plan' | 'architecture' | 'code' | 'setup' | 'telegram';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Дашборд', icon: LayoutDashboard },
    { id: 'content-plan' as Tab, label: 'Контент-план', icon: Calendar },
    { id: 'architecture' as Tab, label: 'Архитектура', icon: Zap },
    { id: 'code' as Tab, label: 'Go Код', icon: Code2 },
    { id: 'setup' as Tab, label: 'Настройка', icon: Settings },
    { id: 'telegram' as Tab, label: 'Telegram Бот', icon: Bot },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'content-plan': return <ContentPlan />;
      case 'architecture': return <Architecture />;
      case 'code': return <GoCode />;
      case 'setup': return <SetupGuide />;
      case 'telegram': return <TelegramBot />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg">Контент Фабрика</h1>
              <p className="text-xs text-gray-400">Go + AI + Дзен</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Система активна
            </div>
            <p className="text-xs text-gray-500 mt-1">v1.0.0 • Go 1.21+</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
