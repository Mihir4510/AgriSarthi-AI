import * as ruleEngine from './ruleEngine.js';
import * as geminiService from './geminiService.js';
import { logRecommendation } from '../models/Schemas.js';

export const runAgent = async (agentName, input, clientApiKey = null, forceDemo = false) => {
  const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
  const isGeminiMode = !forceDemo && !!apiKey;
  
  let mode = isGeminiMode ? 'Gemini AI' : 'Demo Mode';
  let result;
  
  if (isGeminiMode) {
    try {
      console.log(`[ORCHESTRATOR] Routing ${agentName} to Gemini AI Service...`);
      switch (agentName) {
        case 'farm-plan':
          result = await geminiService.getGeminiFarmPlan(apiKey, input);
          break;
        case 'crop-advisor':
          result = await geminiService.getGeminiCropAdvisor(apiKey, input);
          break;
        case 'disease-detect':
          result = await geminiService.getGeminiDiseaseDiagnosis(apiKey, input);
          break;
        case 'weather':
          result = await geminiService.getGeminiWeatherDecisions(apiKey, input.location);
          break;
        case 'market':
          result = await geminiService.getGeminiMarketPrices(apiKey, input.cropName);
          break;
        case 'schemes':
          result = await geminiService.getGeminiSchemes(apiKey, input);
          break;
        default:
          throw new Error(`Unknown agent: ${agentName}`);
      }
    } catch (error) {
      console.error(`[ORCHESTRATOR WARNING] Gemini Agent ${agentName} failed: ${error.message}`);
      console.log(`[ORCHESTRATOR] Falling back to Local Rule Engine...`);
      mode = 'Demo (API Fallback)';
      result = runRuleEngine(agentName, input);
    }
  } else {
    console.log(`[ORCHESTRATOR] Routing ${agentName} to Local Rule Engine (Demo)...`);
    result = runRuleEngine(agentName, input);
  }

  // Inject metadata mode into response
  const responseData = {
    success: true,
    mode,
    data: result
  };

  // Log recommendation asynchronously
  logRecommendation(agentName, input, result, mode).catch(err => {
    console.error(`[LOG ERROR] Failed to record log: ${err.message}`);
  });

  return responseData;
};

const runRuleEngine = (agentName, input) => {
  switch (agentName) {
    case 'farm-plan':
      return ruleEngine.getFarmPlan(input);
    case 'crop-advisor':
      return ruleEngine.getCropAdvisor(input);
    case 'disease-detect':
      return ruleEngine.getDiseaseDiagnosis(input.filename);
    case 'weather':
      return ruleEngine.getWeatherDecisions(input.location);
    case 'market':
      return ruleEngine.getMarketPrices(input.cropName);
    case 'schemes':
      return ruleEngine.getSchemes(input);
    default:
      throw new Error(`Unknown agent: ${agentName}`);
  }
};
