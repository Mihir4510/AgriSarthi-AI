import React, { useState } from 'react';
import api from '../services/api';
import { CloudRain, Sun, Cloud, AlertTriangle, Compass, CheckCircle, Navigation, Wind } from 'lucide-react';

export default function WeatherPanel({ modeSettings }) {
  const [locationInput, setLocationInput] = useState('Indore');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = {
        'x-gemini-key': modeSettings.apiKey || '',
        'x-force-demo': modeSettings.forceDemo ? 'true' : 'false'
      };
      
      const response = await api.post('/weather', {
        location: locationInput
      }, { headers });

      if (response.data.success) {
        setWeather(response.data.data);
      } else {
        alert('Failed to fetch weather decisions.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to weather service.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeoLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // In real-world, we would reverse geocode the lat/lon.
        // For our demo/Gemini integrations, we can pass coordinates or mock name.
        const mockLocation = `Indore (Lat: ${position.coords.latitude.toFixed(2)})`;
        setLocationInput(mockLocation);
        
        try {
          const headers = {
            'x-gemini-key': modeSettings.apiKey || '',
            'x-force-demo': modeSettings.forceDemo ? 'true' : 'false'
          };
          const response = await api.post('/weather', {
            location: mockLocation
          }, { headers });

          if (response.data.success) {
            setWeather(response.data.data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert('Unable to retrieve location. Defaulting to manual input.');
        setLoading(false);
      }
    );
  };

  const getWeatherIcon = (cond) => {
    const norm = cond ? cond.toLowerCase() : '';
    if (norm.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (norm.includes('cloud')) return <Cloud className="w-8 h-8 text-slate-400" />;
    return <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-2">
          <CloudRain className="text-emerald-500 w-8 h-8" /> Weather Intelligence Agent
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Translate forecasts into immediate farm decisions. Clear drainage, schedule sprays, and shelter harvested crops based on weather alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form Panel */}
        <div className="glass-card rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold font-outfit text-white mb-4">Select Location</h3>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Farming Location</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Indore"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  required
                  className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                />
                <button
                  type="button"
                  onClick={handleGeoLocate}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-emerald-400 transition"
                  title="Detect GPS Location"
                >
                  <Navigation className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resolving Weather Decisions...
                </>
              ) : (
                <>
                  Get Weather Decisions
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <h4 className="font-bold text-white text-lg">Querying Weather Systems</h4>
            </div>
          )}

          {!loading && !weather && (
            <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Compass className="w-16 h-16 text-slate-700/60" />
              <div className="max-w-md">
                <h4 className="font-bold text-white text-lg">Predict Farming Action plans</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Input your village name or detect via browser GPS. AgriSathi will convert forecasts into active field-task actions.
                </p>
              </div>
            </div>
          )}

          {!loading && weather && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Primary Current Weather Block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Active Temperature & Humidity */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between glow-green">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">{weather.location} Status</span>
                    <span className="block text-4xl font-extrabold text-white mt-2 font-outfit">{weather.currentTemp}°C</span>
                    <span className="block text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                      <Wind className="w-3 h-3" /> Humidity: {weather.currentHumidity}%
                    </span>
                  </div>
                  {getWeatherIcon(weather.condition)}
                </div>

                {/* Primary Alert Warning banner */}
                <div className="glass-card rounded-2xl p-6 md:col-span-2 border-amber-500/20 bg-amber-500/5 glow-amber flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0 mt-1 animate-bounce" />
                  <div>
                    <span className="text-xs text-amber-500 font-bold uppercase tracking-wide">Threat Advice Alert</span>
                    <p className="font-bold text-white text-sm mt-1">{weather.alert}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Generated by AgriSathi Decision Orchestrator.</p>
                  </div>
                </div>
              </div>

              {/* Agent Decision Guidelines */}
              <div className="glass-card rounded-2xl p-6 glow-green">
                <h3 className="text-lg font-bold font-outfit text-white mb-4">Direct Farm Decisions</h3>
                <div className="space-y-3">
                  {weather.recommendations?.map((rec, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5-day weather schedule forecast grid */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">5-Day Forecast Grid</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {weather.forecast?.map((f, idx) => (
                    <div key={idx} className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col items-center justify-between text-center">
                      <span className="text-[10px] font-bold text-slate-400">{f.day}</span>
                      <div className="my-3">{getWeatherIcon(f.condition)}</div>
                      <span className="text-sm font-bold text-white mt-1">{f.temp}°C</span>
                      <span className="text-[10px] text-blue-400 mt-0.5">{f.rainChance}% Rain</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
