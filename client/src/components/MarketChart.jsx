import React, { useState } from 'react';
import axios from 'axios';
import { TrendingUp, Search, Info, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export default function MarketChart({ modeSettings }) {
  const [cropInput, setCropInput] = useState('Wheat');
  const [loading, setLoading] = useState(false);
  const [market, setMarket] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = {
        'x-gemini-key': modeSettings.apiKey || '',
        'x-force-demo': modeSettings.forceDemo ? 'true' : 'false'
      };
      
      const response = await axios.post('http://localhost:5000/api/market', {
        cropName: cropInput
      }, { headers });

      if (response.data.success) {
        setMarket(response.data.data);
      } else {
        alert('Failed to resolve market trends.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to market database.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to draw custom SVG coordinates for pricing chart
  const renderSVGChart = (data) => {
    if (!data || data.length === 0) return null;
    const minVal = Math.min(...data) * 0.95; // padding min
    const maxVal = Math.max(...data) * 1.05; // padding max
    const range = maxVal - minVal;

    const width = 500;
    const height = 220;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const xInterval = chartWidth / (data.length - 1);

    // Compute coordinate points
    const points = data.map((val, idx) => {
      const x = paddingLeft + idx * xInterval;
      const y = paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;
      return { x, y, value: val, index: idx };
    });

    // Make smooth bezier curve or standard polyline
    const pathD = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    // Area path filled with transparency gradient
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-slate-400">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + ratio * chartHeight;
          const labelVal = Math.round(maxVal - ratio * range);
          return (
            <g key={idx}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="3" />
              <text x={paddingLeft - 10} y={y + 4} textAnchor="end" fontSize="10" className="fill-slate-500 font-mono">
                ₹{labelVal}
              </text>
            </g>
          );
        })}

        {/* X axis labels */}
        {points.map((p, idx) => (
          <text key={idx} x={p.x} y={height - 15} textAnchor="middle" fontSize="10" className="fill-slate-500 font-semibold font-outfit">
            {months[idx]}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#chartGradient)" />

        {/* Main trend line */}
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Interactive nodes */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredPoint?.index === idx ? '6' : '4'}
              className="fill-slate-950 stroke-emerald-400 stroke-2 cursor-pointer hover:stroke-emerald-300 transition duration-150"
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            {/* Tooltip value */}
            {hoveredPoint?.index === idx && (
              <g>
                <rect x={p.x - 35} y={p.y - 30} width="70" height="22" rx="4" className="fill-slate-900 stroke-emerald-500/30 stroke" />
                <text x={p.x} y={p.y - 15} textAnchor="middle" fontSize="10" className="fill-white font-mono font-bold">
                  ₹{p.value}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-2">
          <TrendingUp className="text-emerald-500 w-8 h-8" /> Market Intelligence Agent
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Scan historical Mandi price charts, inspect nearby village rate quotes, and optimize profit gains by timing crop sales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form Search Panel */}
        <div className="glass-card rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold font-outfit text-white mb-4">Mandi Query</h3>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Crop Name</label>
              <input
                type="text"
                placeholder="e.g. Wheat or Soybean"
                value={cropInput}
                onChange={(e) => setCropInput(e.target.value)}
                required
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Comparing Prices...
                </>
              ) : (
                <>
                  Compare Mandis <Search className="w-4 h-4" />
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
              <h4 className="font-bold text-white text-lg">Analyzing Commodity Rates</h4>
            </div>
          )}

          {!loading && !market && (
            <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500 space-y-3">
              <TrendingUp className="w-16 h-16 text-slate-700/60" />
              <div className="max-w-md">
                <h4 className="font-bold text-white text-lg">Compare Pricing Curves</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Query a crop commodity in the side panel. AgriSathi will match nearby mandi data and price timelines.
                </p>
              </div>
            </div>
          )}

          {!loading && market && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Stats highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Current Mandi Rate */}
                <div className="glass-card rounded-2xl p-6 glow-green flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">{market.crop} Mandi Price</span>
                    <span className="block text-3xl font-extrabold text-white mt-2 font-outfit">₹{market.currentPrice}</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Unit: {market.unit}</span>
                  </div>
                </div>

                {/* Best Local Mandi Option */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Optimal Mandi Option</span>
                    <span className="block text-lg font-bold text-white mt-2 font-outfit">{market.bestMandi}</span>
                    <span className="block text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> High volume capacity
                    </span>
                  </div>
                </div>

                {/* Profitability index */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Profit Opportunity Score</span>
                    <span className="block text-3xl font-extrabold text-emerald-400 mt-2 font-outfit">{market.profitabilityScore}/100</span>
                    <span className="block text-[10px] text-slate-400 mt-1">High trade volume indicator</span>
                  </div>
                </div>

              </div>

              {/* Chart & Mandi comparative table */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                {/* SVG Price Chart Card */}
                <div className="glass-card rounded-2xl p-6 md:col-span-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-outfit text-white flex justify-between items-center mb-4">
                      <span>6-Month Price Trend</span>
                      <span className="text-[10px] text-slate-400 font-mono">Hover nodes for values</span>
                    </h3>
                    <div className="w-full aspect-[5/2.2] bg-slate-950/20 rounded-xl p-2 border border-slate-900">
                      {renderSVGChart(market.chartData)}
                    </div>
                  </div>
                </div>

                {/* Mandi comparison rates list */}
                <div className="glass-card rounded-2xl p-6 md:col-span-2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-outfit text-white mb-4">Regional Mandi Options</h3>
                    <div className="space-y-3">
                      {market.otherMandis?.map((m, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl border border-slate-900 hover:border-slate-800 transition">
                          <div>
                            <span className="block font-bold text-white text-xs">{m.name}</span>
                            <span className="block text-[9px] text-slate-500 mt-0.5">Distance: {m.distance}</span>
                          </div>
                          <span className="font-bold text-emerald-400 text-xs">₹{m.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Agent selling recommendations */}
              <div className="glass-card rounded-2xl p-6 border-emerald-500/15 glow-green flex gap-4 items-start">
                <AlertCircle className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Selling Recommendation</h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-950/30 p-3.5 rounded-xl border border-slate-850">
                    {market.recommendation}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
