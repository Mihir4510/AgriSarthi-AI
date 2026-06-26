import React, { useState } from 'react';
import api from '../services/api';
import { Landmark, Search, ChevronDown, ChevronUp, FileText, CheckCircle, Info } from 'lucide-react';

export default function SchemeList({ modeSettings }) {
  const [formData, setFormData] = useState({
    state: 'Madhya Pradesh',
    landSize: 2,
    farmerType: 'Small'
  });

  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'landSize' ? Number(value) : value
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
      
      const response = await api.post('/schemes', formData, { headers });
      if (response.data.success) {
        setSchemes(response.data.data);
        setExpandedIdx(0); // auto-expand first matched item
      } else {
        alert('Failed to match government schemes.');
      }
    } catch (e) {
      console.error(e);
      alert('Error querying government schemes service.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-2">
          <Landmark className="text-emerald-500 w-8 h-8" /> Government Schemes Agent
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Match your profile to central and state-level agricultural subsidies, support schemes, and equipment incentives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Form */}
        <div className="glass-card rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold font-outfit text-white mb-4">Farmer Demographics</h3>
          
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
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Land Area (Acres)</label>
              <input
                type="number"
                name="landSize"
                min="0.1"
                step="0.1"
                value={formData.landSize}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Farmer Classification</label>
              <select
                name="farmerType"
                value={formData.farmerType}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="Small">Small Holder (&lt; 2 Hectares)</option>
                <option value="Marginal">Marginal Holder (&lt; 1 Hectare)</option>
                <option value="Large">Large Landlord (&gt; 2 Hectares)</option>
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
                  Matching Schemes...
                </>
              ) : (
                <>
                  Find Subsidies <Search className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Accordion */}
        <div className="lg:col-span-3 space-y-4">
          {loading && (
            <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <h4 className="font-bold text-white text-lg">Querying Eligibility Databases</h4>
            </div>
          )}

          {!loading && schemes.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Landmark className="w-16 h-16 text-slate-700/60" />
              <div className="max-w-md">
                <h4 className="font-bold text-white text-lg">Query Welfare Subsidies</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your state and land parameters in the side form. AgriSathi will match government incentives.
                </p>
              </div>
            </div>
          )}

          {!loading && schemes.length > 0 && (
            <div className="space-y-4 animate-fadeIn">
              {schemes.map((scheme, idx) => (
                <div key={idx} className="glass-card rounded-2xl overflow-hidden hover:border-emerald-500/20 transition duration-300">
                  
                  {/* Expand header */}
                  <div
                    onClick={() => toggleExpand(idx)}
                    className="p-5 flex justify-between items-center cursor-pointer select-none bg-slate-900/20 hover:bg-slate-900/40 transition"
                  >
                    <div className="flex items-center space-x-3.5">
                      <Landmark className="w-10 h-10 p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0" />
                      <div>
                        <h3 className="font-bold text-white text-sm md:text-base">{scheme.name}</h3>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Matched for Small/Marginal profile</span>
                      </div>
                    </div>
                    {expandedIdx === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>

                  {/* Expand Content */}
                  {expandedIdx === idx && (
                    <div className="p-6 bg-slate-950/20 border-t border-slate-900 space-y-5 text-xs animate-slideDown">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-850">
                          <strong className="text-white block font-bold mb-1.5 flex items-center gap-1"><Info className="w-3.5 h-3.5 text-emerald-500" /> Eligibility Details</strong>
                          <p className="text-slate-300 leading-relaxed">{scheme.eligibility}</p>
                        </div>
                        <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-850">
                          <strong className="text-white block font-bold mb-1.5 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Benefits & Subsidies</strong>
                          <p className="text-slate-300 leading-relaxed">{scheme.benefits}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-2">
                        {/* Application steps */}
                        <div className="md:col-span-3 space-y-2">
                          <strong className="text-white block font-bold mb-2">Application Checklist Checklist</strong>
                          <div className="space-y-2.5">
                            {scheme.steps?.map((step, sIdx) => (
                              <div key={sIdx} className="flex gap-2.5 items-start">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold font-mono text-[9px] flex items-center justify-center shrink-0">
                                  {sIdx + 1}
                                </span>
                                <span className="text-slate-300 leading-relaxed mt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Documents needed */}
                        <div className="md:col-span-2 space-y-2">
                          <strong className="text-white block font-bold mb-2 flex items-center gap-1.5"><FileText className="w-4 h-4 text-emerald-500" /> Mandatory Documents</strong>
                          <div className="space-y-1.5 bg-slate-900/20 p-4 rounded-xl border border-slate-850">
                            {scheme.documents?.map((doc, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2 text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                                <span>{doc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
