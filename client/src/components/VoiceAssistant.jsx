import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Play, Square, RefreshCw } from 'lucide-react';

export default function VoiceAssistant({ modeSettings }) {
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState('hi-IN'); // default to Hindi
  const [transcript, setTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check Web Speech Recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setListening(true);
      setTranscript('Listening...');
      setAgentResponse('');
    };

    rec.onerror = (event) => {
      console.error(event);
      setTranscript(`Speech recognition error: ${event.error}`);
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
    };

    rec.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      await processVoiceCommand(speechToText);
    };

    setRecognition(rec);
  }, [language]);

  const toggleListen = () => {
    if (!supported || !recognition) return;
    if (listening) {
      recognition.stop();
    } else {
      // Stop speech synthesis if speaking
      window.speechSynthesis.cancel();
      setSpeaking(false);
      
      recognition.lang = language;
      recognition.start();
    }
  };

  const processVoiceCommand = async (text) => {
    setAgentResponse('Processing query...');
    const query = text.toLowerCase();
    const headers = {
      'x-gemini-key': modeSettings.apiKey || '',
      'x-force-demo': modeSettings.forceDemo ? 'true' : 'false'
    };

    try {
      // 1. Check for pricing query
      if (query.includes('भाव') || query.includes('price') || query.includes('mandi') || query.includes('मंडी') || query.includes('रेट')) {
        let crop = 'Wheat';
        if (query.includes('soybean') || query.includes('सोयाबीन')) crop = 'Soybean';
        if (query.includes('cotton') || query.includes('कपास')) crop = 'Cotton';

        const response = await api.post('/market', { cropName: crop }, { headers });
        if (response.data.success) {
          const data = response.data.data;
          const speechText = language === 'hi-IN'
            ? `${crop} का ताजा भाव ₹${data.currentPrice} प्रति क्विंटल है। हमारा निर्णय है कि आप अभी 70% फसल बेच दें और शेष को बाद के लिए रखें।`
            : `The current rate for ${crop} is ₹${data.currentPrice} per quintal. Our decision is to sell 70% of your harvest now and store the rest.`;
          
          setAgentResponse(speechText);
          speakResponse(speechText);
        }
      } 
      // 2. Check for Sowing Planner Query (e.g. 2 acres)
      else if (query.includes('एकड़') || query.includes('acres') || query.includes('ज़मीन') || query.includes('grow') || query.includes('लगाऊं') || query.includes('बोएं')) {
        let acres = 2;
        const matches = query.match(/\d+/);
        if (matches) acres = parseInt(matches[0]);

        const response = await api.post('/farm-plan', {
          location: 'Indore',
          acres: acres,
          soilType: 'Black',
          budget: 50000,
          waterLevel: 'medium',
          season: 'Kharif',
          goal: 'Maximum Profit'
        }, { headers });

        if (response.data.success) {
          const data = response.data.data;
          const speechText = language === 'hi-IN'
            ? `आपके ${acres} एकड़ के लिए AgriSathi का निर्णय ${data.recommendedCrop} बोने का है। अनुमानित लाभ ₹${data.financials.expectedProfit} है। प्रथम सप्ताह में भूमि गहरी जुताई करें।`
            : `For your ${acres} acres, AgriSathi advises sowing ${data.recommendedCrop}. Projected profit is ₹${data.financials.expectedProfit}. Start with deep land ploughing in week 1.`;
          
          setAgentResponse(speechText);
          speakResponse(speechText);
        }
      }
      // 3. Fallback generic query
      else {
        const speechText = language === 'hi-IN'
          ? "मुझे समझ नहीं आया। आप पूछ सकते हैं: 'गेहूं का भाव क्या है' या 'मेरे पास 2 एकड़ जमीन है क्या लगाऊं?'"
          : "I could not identify the command. You can ask: 'What is the price of wheat?' or 'I have 2 acres, what should I grow?'";
        
        setAgentResponse(speechText);
        speakResponse(speechText);
      }
    } catch (e) {
      console.error(e);
      const errorMsg = 'Failed to process voice query via server API.';
      setAgentResponse(errorMsg);
      speakResponse(errorMsg);
    }
  };

  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // cancel any active speaking

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1.0;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-2">
          <Mic className="text-emerald-500 w-8 h-8 animate-pulse" /> Voice Assistant
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Bilingual Voice Assistant. Ask queries in Hindi or English to get instant hands-free agricultural decisions.
        </p>
      </div>

      {!supported && (
        <div className="glass-card rounded-2xl p-6 border-red-500/20 bg-red-500/5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">Speech API Not Supported</h4>
            <p className="text-xs text-slate-400 mt-1">
              Your browser does not support the Web Speech API. Please switch to Google Chrome, Microsoft Edge, or Safari for complete features.
            </p>
          </div>
        </div>
      )}

      {supported && (
        <div className="space-y-6">
          {/* Main Visual Microphone Card */}
          <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center glow-green space-y-6">
            
            {/* Lang toggler */}
            <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setLanguage('hi-IN')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition ${language === 'hi-IN' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => setLanguage('en-IN')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition ${language === 'en-IN' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                English (India)
              </button>
            </div>

            {/* Mic trigger button */}
            <div className="relative flex items-center justify-center">
              {listening && (
                <div className="absolute w-24 h-24 bg-emerald-500/10 rounded-full animate-ping border border-emerald-500/20"></div>
              )}
              <button
                onClick={toggleListen}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition ${listening ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-slate-900 border border-slate-800 hover:border-emerald-500/30 text-emerald-400'}`}
              >
                {listening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8 text-slate-500" />}
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-base">
                {listening ? 'Listening to your query...' : 'Microphone Ready'}
              </h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                {language === 'hi-IN'
                  ? "बोलने के लिए माइक बटन दबाएं। उदाहरण: 'गेहूं का भाव क्या है?' या 'मेरे पास २ एकड़ जमीन है क्या लगाएं?'"
                  : "Tap mic button to speak. Example: 'What is the price of wheat?' or 'I have 2 acres, what should I grow?'"}
              </p>
            </div>
          </div>

          {/* Transcript & Response feed */}
          <div className="space-y-4">
            {/* User Transcript box */}
            {transcript && (
              <div className="glass-card rounded-2xl p-5 border-slate-900/60 bg-slate-950/20">
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">User Query Transcribed</span>
                <p className="text-sm font-semibold text-white italic">"{transcript}"</p>
              </div>
            )}

            {/* AI Voice response box */}
            {agentResponse && (
              <div className="glass-card rounded-2xl p-6 glow-green relative overflow-hidden animate-fadeIn">
                <span className="text-[10px] text-emerald-500 font-bold uppercase block mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AgriSathi Verbal Output
                </span>
                
                <p className="text-sm text-slate-300 leading-relaxed">
                  {agentResponse}
                </p>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-900">
                  {speaking ? (
                    <button
                      onClick={stopSpeaking}
                      className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 active:scale-95 transition"
                    >
                      <Square className="w-3.5 h-3.5" /> Stop Speaking
                    </button>
                  ) : (
                    <button
                      onClick={() => speakResponse(agentResponse)}
                      className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 active:scale-95 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Repeat Audio
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
