import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Sprout, TrendingUp, ShieldCheck, CheckCircle, Activity, ChevronRight, Zap } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentLog, setRecentLog] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/history/farm-plans');
      if (response.data.success && response.data.data.length > 0) {
        setPlans(response.data.data);
        setRecentLog(response.data.data[0]);
      }
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick statistics based on recent plan
  const activeCrop = recentLog ? recentLog.recommendedCrop : 'None Sown';
  const location = recentLog ? recentLog.location : 'Indore (Default)';
  const acres = recentLog ? recentLog.acres : '—';
  
  // Custom mock active alerts to match the agent outputs
  const alerts = [
    {
      id: 1,
      type: 'weather',
      severity: 'high',
      title: 'Heavy Rain Forecast (45mm)',
      desc: 'Expected in 48 hours. Delay urea fertilizer application and irrigation.',
      icon: AlertTriangle,
      color: 'text-amber-500 border-amber-500/20 bg-amber-500/5'
    },
    {
      id: 2,
      type: 'market',
      severity: 'info',
      title: 'Soybean Mandi Peak Rate reached',
      desc: 'Rates are 12% above seasonal average in Dewas. Recommended to sell 70% of dried stock.',
      icon: TrendingUp,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white">Farm Intelligence Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time alerts and actionable recommendations for your fields.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Grid of quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400">Active Recommended Crop</span>
            <span className="block text-lg font-bold text-white font-outfit">{activeCrop}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400">Farm Location & Area</span>
            <span className="block text-lg font-bold text-white font-outfit">{location} {acres !== '—' ? `(${acres} Ac)` : ''}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400">Threat Risk Level</span>
            <span className="block text-lg font-bold text-amber-400 font-outfit">Moderate (Rain)</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400">Market Price Index</span>
            <span className="block text-lg font-bold text-emerald-400 font-outfit">Strong (Bullish)</span>
          </div>
        </div>
      </div>

      {/* Main double column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Alerts and Quick Advice */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Alerts */}
          <div className="glass-card rounded-2xl p-6 glow-amber">
            <h3 className="text-xl font-bold font-outfit text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-500 w-5 h-5" /> Critical Agent Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-xl border ${alert.color}`}>
                  <alert.icon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Feed */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                <Zap className="text-emerald-500 w-5 h-5 animate-pulse" /> Urgent Recommendations
              </h3>
              <button 
                onClick={() => setActiveTab('weather')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-0.5"
              >
                Go to Weather Agent <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Postpone Urea application today:</strong> Weather reports predict heavy showers on Wednesday which will leach fertilizers.
                </p>
              </div>
              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Clear peripheral drainage channels:</strong> Avoid field waterlogging before heavy rains occur to protect seed roots.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Farm History and Plans Overview */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold font-outfit text-white mb-4 flex items-center gap-2">
                <Sprout className="text-emerald-500 w-5 h-5" /> Recent Farm Plans
              </h3>

              {loading ? (
                <div className="py-8 text-center text-slate-500 text-xs">Loading plans...</div>
              ) : plans.length === 0 ? (
                <div className="py-8 text-center text-slate-500 space-y-3">
                  <p className="text-xs">No active farm plans found. Generate your first plan to start tracking.</p>
                  <button
                    onClick={() => setActiveTab('farm-plan')}
                    className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-600/30 transition"
                  >
                    Launch Farm Planner
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {plans.map((p, idx) => (
                    <div key={p._id || idx} className="p-3 bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800 hover:border-slate-700/60 rounded-xl transition cursor-pointer" onClick={() => setActiveTab('farm-plan')}>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-sm">{p.recommendedCrop}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25">{p.season}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                        <span>{p.location} • {p.acres} Acres</span>
                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {plans.length > 0 && (
              <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => setActiveTab('farm-plan')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-950/20 active:scale-95 transition"
                >
                  View Active Sowing Plan <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
