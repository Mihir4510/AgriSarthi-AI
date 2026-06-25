import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, ShieldAlert, Sparkles, Key, CheckCircle, RefreshCw } from 'lucide-react';

export default function SettingsPanel({ modeSettings, setModeSettings }) {
  const [dbConnected, setDbConnected] = useState(false);
  const [loadingDb, setLoadingDb] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(modeSettings.apiKey || '');
  const [demoMode, setDemoMode] = useState(modeSettings.forceDemo);

  const checkDbStatus = async () => {
    setLoadingDb(true);
    try {
      const response = await axios.get('http://localhost:5000/api/db-status');
      setDbConnected(response.data.connected);
    } catch (e) {
      setDbConnected(false);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    checkDbStatus();
  }, []);

  const handleSave = () => {
    const newSettings = {
      forceDemo: demoMode,
      apiKey: apiKeyInput
    };
    setModeSettings(newSettings);
    localStorage.setItem('agrisathi_settings', JSON.stringify(newSettings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-2">
        <Sparkles className="w-8 h-8 text-emerald-500" />
        <h2 className="text-3xl font-bold font-outfit text-white">System Settings</h2>
      </div>

      <p className="text-slate-400 text-sm">
        Configure the operational mode of AgriSathi AI. You can toggle between client-side local expert simulation and real-world Gemini AI decisions.
      </p>

      {/* Mode Selection */}
      <div className="glass-card rounded-2xl p-6 glow-green">
        <h3 className="text-xl font-bold mb-4 font-outfit text-white flex items-center gap-2">
          <Key className="text-emerald-500 w-5 h-5" /> Mode Configuration
        </h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition">
            <input
              type="radio"
              id="modeDemo"
              name="engineMode"
              checked={demoMode}
              onChange={() => setDemoMode(true)}
              className="mt-1 accent-emerald-500 w-4 h-4"
            />
            <label htmlFor="modeDemo" className="cursor-pointer">
              <span className="block font-semibold text-white">Demo Mode (Local Expert System)</span>
              <span className="block text-xs text-slate-400">
                Runs instantly using pre-configured high-fidelity regional agricultural rules. Requires no API keys.
              </span>
            </label>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition">
            <input
              type="radio"
              id="modeGemini"
              name="engineMode"
              checked={!demoMode}
              onChange={() => setDemoMode(false)}
              className="mt-1 accent-emerald-500 w-4 h-4"
            />
            <label htmlFor="modeGemini" className="cursor-pointer">
              <span className="block font-semibold text-white flex items-center gap-1.5">
                Gemini AI Mode <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/20">Enhanced</span>
              </span>
              <span className="block text-xs text-slate-400">
                Enables true agentic reasoning by querying Gemini 1.5 Flash. Falls back to Demo Mode if the API call fails.
              </span>
            </label>
          </div>
        </div>

        {!demoMode && (
          <div className="mt-4 pl-7 space-y-2">
            <label className="block text-xs font-medium text-slate-400">Gemini API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
            />
            <p className="text-[10px] text-slate-500">
              Your API Key is saved locally in your browser storage and is only sent to the Express proxy headers.
            </p>
          </div>
        )}
      </div>

      {/* Database Connection Status */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 font-outfit text-white flex items-center gap-2">
          <Database className="text-blue-500 w-5 h-5" /> Database Status
        </h3>

        <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <Database className={`w-10 h-10 p-2 rounded-xl ${dbConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`} />
            <div>
              <span className="block font-semibold text-sm text-white">MongoDB Connection</span>
              <span className="block text-xs text-slate-400">
                {dbConnected ? 'Connected to local/atlas database.' : 'Offline. Running with volatile memory stores.'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${dbConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {dbConnected ? <CheckCircle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
              {dbConnected ? 'Live' : 'Mock Fallback'}
            </span>
            
            <button 
              onClick={checkDbStatus} 
              disabled={loadingDb}
              className="p-1 text-slate-400 hover:text-white transition disabled:opacity-50"
              title="Refresh connection status"
            >
              <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-95 transition"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
