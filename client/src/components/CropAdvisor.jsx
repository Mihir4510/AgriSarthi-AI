import React, { useState } from 'react';
import axios from 'axios';
import { Compass, Search, Leaf, Info, Droplet, Star, TrendingUp } from 'lucide-react';

export default function CropAdvisor({ modeSettings }) {
  const [formData, setFormData] = useState({
    state: 'Madhya Pradesh',
    district: 'Indore',
    soilType: 'Black',
    season: 'Kharif'
  });

  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = {
        'x-gemini-key': modeSettings.apiKey || '',
        'x-force-demo': modeSettings.forceDemo ? 'true' : 'false'
      };
      
      const response = await axios.post('http://localhost:5000/api/crop-advisor', formData, { headers });
      if (response.data.success) {
        setCrops(response.data.data);
      } else {
        alert('Failed to fetch crop advice.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-2">
          <Leaf className="text-emerald-500 w-8 h-8" /> Crop Advisor Agent
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Compare suitable crops for your soil profile and climate parameters. Review rankings based on profitability and water footprint.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form panel */}
        <div className="glass-card rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold font-outfit text-white mb-4">Location & Soil Details</h3>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Soil Type</label>
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

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Season</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Comparing Crops...
                </>
              ) : (
                <>
                  Find Suitable Crops <Search className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <h4 className="font-bold text-white text-lg">Analyzing Climate Compatibility</h4>
            </div>
          )}

          {!loading && crops.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Compass className="w-16 h-16 text-slate-700/60" />
              <div className="max-w-md">
                <h4 className="font-bold text-white text-lg">Compare Regional Crops</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Specify location and soil classification parameters to retrieve top suitable choices.
                </p>
              </div>
            </div>
          )}

          {!loading && crops.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              {crops.map((crop) => (
                <div 
                  key={crop.name} 
                  className={`glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/30 transition duration-300 ${crop.rank === 1 ? 'glow-green border-emerald-500/20' : ''}`}
                >
                  {crop.rank === 1 && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 px-3 py-1 text-[10px] font-bold rounded-bl-xl uppercase tracking-wider flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> Best Match
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Rank #{crop.rank}</span>
                    <h3 className="text-2xl font-bold font-outfit text-white mt-1">{crop.name}</h3>

                    {/* Compatibility score pill bar */}
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Compatibility Score</span>
                        <span className="font-bold text-emerald-400">{crop.suitability}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${crop.suitability}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-3 mt-6">
                      <div className="flex justify-between items-center text-xs p-2.5 bg-slate-900/40 rounded-xl border border-slate-800">
                        <span className="text-slate-400 flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-slate-500" /> Est. Yield</span>
                        <span className="font-bold text-white">{crop.yield}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs p-2.5 bg-slate-900/40 rounded-xl border border-slate-800">
                        <span className="text-slate-400 flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5 text-blue-400" /> Water Need</span>
                        <span className={`font-bold ${crop.water === 'Low' ? 'text-emerald-400' : crop.water === 'Medium' ? 'text-amber-400' : 'text-blue-400'}`}>
                          {crop.water}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs p-2.5 bg-slate-900/40 rounded-xl border border-slate-800">
                        <span className="text-slate-400 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Profit Potential</span>
                        <span className="font-bold text-emerald-400">{crop.profit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/60 text-slate-500 text-[10px] text-center">
                    Optimized for {formData.district} soils.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
