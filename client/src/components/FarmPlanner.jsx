import React, { useState } from 'react';
import axios from 'axios';
import { Sprout, IndianRupee, MapPin, Calendar, Compass, Layers, Droplet, ArrowRight, ShieldAlert, Sparkles, CheckSquare, Square, CheckCircle } from 'lucide-react';

export default function FarmPlanner({ modeSettings }) {
  const [formData, setFormData] = useState({
    location: 'Indore',
    acres: 2,
    soilType: 'Black',
    budget: 60000,
    waterLevel: 'medium',
    season: 'Kharif',
    goal: 'Maximum Profit'
  });

  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [checklist, setChecklist] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'acres' || name === 'budget' ? Number(value) : value
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = {
        'x-gemini-key': modeSettings.apiKey || '',
        'x-force-demo': modeSettings.forceDemo ? 'true' : 'false'
      };
      
      const response = await axios.post('http://localhost:5000/api/farm-plan', formData, { headers });
      if (response.data.success) {
        setPlanResult(response.data.data);
        setChecklist(response.data.data.checklist || []);
      } else {
        alert('Failed to generate plan. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to server. Please check that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-2">
            <Sprout className="text-emerald-500 w-8 h-8" /> Farm Planner Agent
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Construct a localized crop cultivation strategy detailing week-wise schedules, finance splits, and risk hedges.
          </p>
        </div>
        {planResult && (
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Output Engine: {planResult.recommendedCrop ? 'AI Optimized' : 'Standard'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sowing Profile Form */}
        <div className="glass-card rounded-2xl p-6 h-fit">
          <h3 className="text-xl font-bold font-outfit text-white mb-4">Sowing Profile</h3>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Location / Village
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" /> Land Size (Acres)
                </label>
                <input
                  type="number"
                  name="acres"
                  min="0.5"
                  step="0.5"
                  value={formData.acres}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Sowing Budget (₹)
                </label>
                <input
                  type="number"
                  name="budget"
                  min="1000"
                  step="500"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-500" /> Soil Classification
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="Black">Black Soil (Regur)</option>
                <option value="Red">Red Soil</option>
                <option value="Loam">Alluvial / Loamy Soil</option>
                <option value="Clay">Heavy Clay Soil</option>
                <option value="Sandy">Sandy Soil</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Season
                </label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                >
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Summer">Summer (Zaid)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-emerald-500" /> Water Level
                </label>
                <select
                  name="waterLevel"
                  value={formData.waterLevel}
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                >
                  <option value="high">High Availability</option>
                  <option value="medium">Medium Rainfed</option>
                  <option value="low">Low / Borewell Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-emerald-500" /> Sowing Goal
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="Maximum Profit">Maximum Profit Yield</option>
                <option value="Low Risk">Low Input Risk (Hedge)</option>
                <option value="Fast Yield">Fast Cultivation Cycle</option>
                <option value="Water Saving">Optimized Water Saving</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Farm Profile...
                </>
              ) : (
                <>
                  Generate Sowing Plan <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 glow-green">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-lg">Running AgriSathi Intelligence</h4>
                <p className="text-slate-400 text-xs">Simulating weather constraints, checking nutrient levels, and computing cashflows...</p>
              </div>
            </div>
          )}

          {!loading && !planResult && (
            <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Sprout className="w-16 h-16 text-slate-700/60 animate-bounce" />
              <div className="max-w-md">
                <h4 className="font-bold text-white text-lg">Awaiting Sowing Inputs</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Submit details about your soil, season, and budget in the sidebar panel. AgriSathi will build an actionable cultivation roadmap.
                </p>
              </div>
            </div>
          )}

          {!loading && planResult && (
            <div className="space-y-6 animate-fadeIn">
              {/* Recommended Crop Card */}
              <div className="glass-card rounded-2xl p-6 glow-green relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500/15 text-emerald-400 px-4 py-1.5 rounded-bl-2xl text-xs font-bold border-l border-b border-emerald-500/25">
                  Recommendation
                </div>
                
                <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold">Optimal Crop Selected</span>
                <h3 className="text-4xl font-bold font-outfit text-white mt-1">{planResult.recommendedCrop}</h3>
                
                <p className="text-sm text-slate-300 mt-4 leading-relaxed bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                  {planResult.reasoning}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Est. Yield Per Acre</span>
                    <span className="block text-lg font-bold text-white mt-0.5">{planResult.yieldEstimate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Total Expected Yield</span>
                    <span className="block text-lg font-bold text-white mt-0.5">{planResult.expectedYieldTotal}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Est. Cultivation Cost</span>
                    <span className="block text-lg font-bold text-red-400 mt-0.5">₹{planResult.financials?.totalCost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Projected Net Profit</span>
                    <span className="block text-lg font-bold text-emerald-400 mt-0.5">₹{planResult.financials?.expectedProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Financial cost breakdown */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold font-outfit text-white mb-4">Budget Allocations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(planResult.financials?.costBreakdown || {}).map(([key, value]) => (
                    <div key={key} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{key}</span>
                      <span className="text-xl font-bold text-white mt-2">₹{value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action plan Timeline */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold font-outfit text-white mb-4">10-Week Cultivation Roadmap</h3>
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {planResult.actionPlan?.map((item) => (
                    <div key={item.week} className="flex gap-4 p-3 hover:bg-slate-900/30 rounded-xl transition border border-transparent hover:border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center justify-center shrink-0">
                        Wk {item.week}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Checklists */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold font-outfit text-white mb-4 flex items-center gap-1.5">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> Pre-Sowing Checklist
                  </h3>
                  <div className="space-y-3">
                    {checklist.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="flex items-start gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-white/5 transition"
                      >
                        {item.done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                        )}
                        <span className={`text-xs select-none ${item.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Threat Mitigation Risk Box */}
                <div className="glass-card rounded-2xl p-6 border-red-500/15">
                  <h3 className="text-lg font-bold font-outfit text-white mb-4 flex items-center gap-1.5">
                    <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" /> Risk Assessments
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                      <strong className="text-white block font-semibold">Climate threats:</strong>
                      <span className="text-slate-400 block mt-1">{planResult.risks?.weather}</span>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                      <strong className="text-white block font-semibold">Biological threat (Pests):</strong>
                      <span className="text-slate-400 block mt-1">{planResult.risks?.pest}</span>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                      <strong className="text-white block font-semibold">Soil compaction:</strong>
                      <span className="text-slate-400 block mt-1">{planResult.risks?.soil}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
