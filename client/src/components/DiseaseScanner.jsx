import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Image as ImageIcon, Sparkles, CheckCircle, ShieldAlert, AlertCircle, Wrench } from 'lucide-react';

export default function DiseaseScanner({ modeSettings }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);

  const samples = [
    { name: 'Healthy Maize Leaf', file: 'healthy_leaf.png', path: '/assets/healthy_leaf.png' },
    { name: 'Common Rust Leaf', file: 'rust_leaf.png', path: '/assets/rust_leaf.png' },
    { name: 'Early Blight Leaf', file: 'blight_leaf.png', path: '/assets/blight_leaf.png' }
  ];

  const handleSelectSample = (sample) => {
    if (scanning) return;
    setSelectedImage(sample.path);
    setImageName(sample.file);
    setDiagnosis(null);
  };

  const handleCustomUpload = (e) => {
    if (scanning) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setImageName(file.name);
        setDiagnosis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScanning = () => {
    if (!selectedImage || scanning) return;
    setScanning(true);
    setDiagnosis(null);
    setScanLogs([]);

    const logMessages = [
      'Initialize neural network model layers...',
      'Load crop leaf bitmap image matrix...',
      'Segmenting background noise levels...',
      'Executing convolutional filters on green channel...',
      'Spotting chlorosis and necrosis lesions...',
      'Matching patterns with regional blight and rust profiles...',
      'Finalizing confidence weights and treatments...'
    ];

    // Animate log messages one by one over 2.5s
    logMessages.forEach((msg, idx) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, `[LOG] ${msg}`]);
      }, idx * 300);
    });

    // Run final backend request once logs finish
    setTimeout(async () => {
      try {
        const headers = {
          'x-gemini-key': modeSettings.apiKey || '',
          'x-force-demo': modeSettings.forceDemo ? 'true' : 'false'
        };
        const response = await axios.post('http://localhost:5000/api/disease-detect', {
          filename: imageName
        }, { headers });

        if (response.data.success) {
          setDiagnosis(response.data.data);
        } else {
          alert('Failed to diagnose leaf image.');
        }
      } catch (e) {
        console.error(e);
        alert('Server connection error during diagnosis.');
      } finally {
        setScanning(false);
      }
    }, logMessages.length * 300 + 400);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-2">
          <Camera className="text-emerald-500 w-8 h-8" /> Disease Detection Agent
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Perform a convolutional diagnostic scan on crop leaves. Select a preset demo image below or upload your own leaf image to identify symptoms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Upload / Selector & Laser Scanning Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
            <h3 className="text-lg font-bold font-outfit text-white mb-4 w-full text-left flex justify-between items-center">
              <span>Leaf Analyzer Workspace</span>
              {scanning && (
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  SCANNING ACTIVE
                </span>
              )}
            </h3>

            {/* Viewbox container */}
            <div className="relative w-full aspect-square bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center group select-none">
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Crop Leaf" className="w-full h-full object-cover" />
                  {scanning && <div className="scanner-line"></div>}
                </>
              ) : (
                <div className="text-center p-6 text-slate-500 space-y-3">
                  <ImageIcon className="w-14 h-14 mx-auto text-slate-800 animate-pulse" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-400">No Leaf Selected</p>
                    <p className="mt-1 text-slate-500 text-[10px]">Select a sample leaf image below or upload a photo to begin scanning.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Custom file upload input */}
            <div className="w-full mt-4 flex gap-2">
              <label className="flex-1 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs text-center cursor-pointer active:scale-95 transition">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleCustomUpload} disabled={scanning} />
              </label>

              <button
                onClick={startScanning}
                disabled={!selectedImage || scanning}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs active:scale-95 transition disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/20"
              >
                <Sparkles className="w-3.5 h-3.5" /> Start Scan
              </button>
            </div>
          </div>

          {/* Sample board */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Demo Presets</h3>
            <div className="grid grid-cols-3 gap-2">
              {samples.map((sample) => (
                <div
                  key={sample.file}
                  onClick={() => handleSelectSample(sample)}
                  className={`cursor-pointer rounded-xl border overflow-hidden p-1 bg-slate-950/50 hover:bg-slate-900 transition flex flex-col justify-between ${imageName === sample.file ? 'border-emerald-500/60 ring-2 ring-emerald-500/10' : 'border-slate-800'}`}
                >
                  <img src={sample.path} alt={sample.name} className="aspect-square w-full object-cover rounded-lg" />
                  <span className="text-[9px] text-center text-slate-400 font-semibold block mt-1.5 truncate px-1">
                    {sample.name.split(' ')[0]} Leaf
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Scan Console Log & Diagnostic Printout */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnostic Console (Shows scanner logs) */}
          {(scanning || scanLogs.length > 0) && !diagnosis && (
            <div className="glass-card rounded-2xl p-6 bg-black/60 border-slate-900 font-mono text-xs glow-green h-full min-h-[300px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-3 text-slate-500">
                  <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-emerald-500 animate-pulse" /> Diagnostics Console</span>
                  <span className="text-[10px]">Matrix: RGB_224</span>
                </div>
                <div className="space-y-1.5 text-emerald-400 max-h-[220px] overflow-y-auto pr-1">
                  {scanLogs.map((log, idx) => (
                    <div key={idx} className="animate-fadeIn">{log}</div>
                  ))}
                  {scanning && (
                    <div className="flex items-center gap-1 mt-1 text-slate-400 italic">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Evaluating tensor coefficients...
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[9px] text-slate-500 pt-4 border-t border-slate-900/60">
                AgriSathi Scan v1.0.0 — Convolutional Diagnostic Pipeline
              </div>
            </div>
          )}

          {/* Prompt standard placeholder */}
          {!scanning && scanLogs.length === 0 && !diagnosis && (
            <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500 h-full min-h-[360px]">
              <Sparkles className="w-14 h-14 text-slate-700/60 mb-3 animate-pulse" />
              <div className="max-w-md">
                <h4 className="font-bold text-white text-lg">Diagnostics Report Ready</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Launch the leaf scanning engine. The system will display identified diseases, severity indexes, and treatment blueprints.
                </p>
              </div>
            </div>
          )}

          {/* Diagnostic Printout Report Card */}
          {!scanning && diagnosis && (
            <div className="space-y-6 animate-fadeIn">
              <div className="glass-card rounded-2xl p-6 glow-green relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-bl-2xl text-xs font-bold border-l border-b border-emerald-500/25">
                  Scan Diagnostics
                </div>

                <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold">Pathogen Identified</span>
                <h3 className="text-2xl md:text-3xl font-bold font-outfit text-white mt-1">{diagnosis.diseaseName}</h3>

                <div className="grid grid-cols-2 gap-4 mt-5 p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl text-xs">
                  <div>
                    <span className="block text-slate-500 font-semibold">Confidence Rating</span>
                    <span className="block text-lg font-bold text-emerald-400 mt-0.5">{diagnosis.confidenceScore}%</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold">Severity Rating</span>
                    <span className={`block text-lg font-bold mt-0.5 ${diagnosis.severityLevel === 'None' ? 'text-emerald-400' : diagnosis.severityLevel === 'Moderate' ? 'text-amber-400' : 'text-red-400'}`}>
                      {diagnosis.severityLevel}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <h4 className="font-bold text-white text-sm">Symptoms Description</h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-800">
                    {diagnosis.symptoms}
                  </p>
                </div>
              </div>

              {/* Treatment Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Immediate Treat Plan */}
                <div className="glass-card rounded-2xl p-6 border-emerald-500/15">
                  <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-emerald-400" /> Active Treatments
                  </h4>
                  <ul className="space-y-3">
                    {diagnosis.treatmentPlan?.map((step, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Long Term Prevention */}
                <div className="glass-card rounded-2xl p-6 border-blue-500/15">
                  <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-blue-400" /> Preventive Guidelines
                  </h4>
                  <ul className="space-y-3">
                    {diagnosis.preventionSteps?.map((step, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-slate-300">
                        <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
