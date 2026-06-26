import React, { useState, useEffect } from 'react';
import api from './services/api';
import { LayoutDashboard, Sprout, Leaf, Camera, CloudRain, TrendingUp, Landmark, Mic, Settings, Sparkles, Database } from 'lucide-react';
import Dashboard from './components/Dashboard';
import FarmPlanner from './components/FarmPlanner';
import CropAdvisor from './components/CropAdvisor';
import DiseaseScanner from './components/DiseaseScanner';
import WeatherPanel from './components/WeatherPanel';
import MarketChart from './components/MarketChart';
import SchemeList from './components/SchemeList';
import VoiceAssistant from './components/VoiceAssistant';
import SettingsPanel from './components/SettingsPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modeSettings, setModeSettings] = useState({
    forceDemo: true,
    apiKey: ''
  });
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    // Load local storage settings
    const stored = localStorage.getItem('agrisathi_settings');
    if (stored) {
      setModeSettings(JSON.parse(stored));
    }

    // Monitor MongoDB connectivity
    const checkDB = async () => {
      try {
        const res = await api.get('/db-status');
        setDbConnected(res.data.connected);
      } catch (e) {
        setDbConnected(false);
      }
    };
    checkDB();
    const interval = setInterval(checkDB, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'farm-plan', name: 'Farm Planner Agent', icon: Sprout, hero: true },
    { id: 'crop-advisor', name: 'Crop Advisor Agent', icon: Leaf },
    { id: 'disease-detect', name: 'Disease Detection Agent', icon: Camera },
    { id: 'weather', name: 'Weather Intelligence', icon: CloudRain },
    { id: 'market', name: 'Market Intelligence', icon: TrendingUp },
    { id: 'schemes', name: 'Government Schemes', icon: Landmark },
    { id: 'voice-assistant', name: 'Voice Assistant', icon: Mic },
    { id: 'settings', name: 'System Settings', icon: Settings }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'farm-plan':
        return <FarmPlanner modeSettings={modeSettings} />;
      case 'crop-advisor':
        return <CropAdvisor modeSettings={modeSettings} />;
      case 'disease-detect':
        return <DiseaseScanner modeSettings={modeSettings} />;
      case 'weather':
        return <WeatherPanel modeSettings={modeSettings} />;
      case 'market':
        return <MarketChart modeSettings={modeSettings} />;
      case 'schemes':
        return <SchemeList modeSettings={modeSettings} />;
      case 'voice-assistant':
        return <VoiceAssistant modeSettings={modeSettings} />;
      case 'settings':
        return <SettingsPanel modeSettings={modeSettings} setModeSettings={setModeSettings} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-slate-100 font-inter">
      {/* Sidebar Panel */}
      <aside className="lg:w-64 glass-panel flex flex-col justify-between shrink-0 p-5 lg:sticky lg:top-0 lg:h-screen z-10">
        <div>
          {/* Logo brand */}
          <div className="flex items-center space-x-2.5 mb-8">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Sprout className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="block font-black text-lg tracking-tight font-outfit text-white">AgriSathi AI</span>
              <span className="block text-[9px] uppercase tracking-wider text-emerald-500 font-bold">Decision Assistant</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold select-none active:scale-95 transition-all duration-150 relative ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.name}</span>
                {item.hero && (
                  <span className="absolute right-2.5 top-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-slate-900/60 text-[10px] text-slate-500 space-y-1">
          <p>© 2026 AgriSathi AI.</p>
          <p>Agents for Good Project.</p>
        </div>
      </aside>

      {/* Main content body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Status Header */}
        <header className="h-16 px-6 border-b border-slate-900 flex justify-between items-center bg-slate-950/20 z-0">
          <h1 className="font-outfit text-sm font-bold text-white hidden md:block">
            {navItems.find((n) => n.id === activeTab)?.name}
          </h1>
          <div className="flex items-center gap-3.5 ml-auto text-[10px] font-semibold">
            {/* API Mode Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${modeSettings.forceDemo ? 'bg-slate-900/50 text-slate-400 border-slate-800' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-green'}`}>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Mode: {modeSettings.forceDemo ? 'Demo System' : 'Gemini AI'}</span>
            </div>

            {/* DB Connection Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${dbConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>Database: {dbConnected ? 'Live' : 'Mock'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic view rendering viewport */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActiveTab()}
        </main>

      </div>
    </div>
  );
}
