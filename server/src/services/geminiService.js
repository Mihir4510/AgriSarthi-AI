import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Common helper to interact with Gemini API and enforce JSON response
 */
const queryGemini = async (apiKey, systemInstruction, userPrompt) => {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-1.5-flash as the standard robust model
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemInstruction,
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const response = await result.response;
  const text = response.text();
  return JSON.parse(text);
};

export const getGeminiFarmPlan = async (apiKey, input) => {
  const systemInstruction = `
    You are the AgriSathi AI Hero Farm Planner Agent.
    Your job is to provide specific, actionable farming decisions, not general guidance.
    You must output a single JSON object. Do not include markdown code block formatting (like \`\`\`json) in the response text, just return the raw JSON object.
    
    The JSON structure MUST match:
    {
      "recommendedCrop": "Name of crop",
      "reasoning": "Reason for selection based on geography, budget, soil type, season, goal, etc. Write in an agentic tone.",
      "acres": 2,
      "soilType": "Black",
      "season": "Kharif",
      "goal": "Maximum Profit",
      "yieldEstimate": "expected yield range (e.g. 10 - 15 quintals/acre)",
      "expectedYieldTotal": "total expected yield range for the land (e.g. 20 - 30 quintals)",
      "financials": {
        "expectedRevenue": 140000,
        "totalCost": 48000,
        "expectedProfit": 92000,
        "costBreakdown": {
          "seeds": 8000,
          "fertilizers": 15000,
          "irrigation": 7000,
          "labor": 18000
        }
      },
      "actionPlan": [
        { "week": 1, "title": "...", "desc": "..." },
        { "week": 2, "title": "...", "desc": "..." }
      ],
      "risks": {
        "weather": "weather-related decision alerts (e.g., watch out for high rain)",
        "pest": "pest-related warnings",
        "soil": "soil risk mitigation plans"
      },
      "checklist": [
        { "id": "c1", "task": "Actionable checklist item 1", "done": false },
        { "id": "c2", "task": "Actionable checklist item 2", "done": false }
      ]
    }
  `;

  const userPrompt = `
    Input Parameters:
    - Location: ${input.location}
    - Land Size: ${input.acres} acres
    - Soil Type: ${input.soilType}
    - Budget: ₹${input.budget}
    - Water Level: ${input.waterLevel}
    - Season: ${input.season}
    - Farming Goal: ${input.goal}
    
    Provide the optimal crop and complete 10-week agentic farming plan.
  `;

  return await queryGemini(apiKey, systemInstruction, userPrompt);
};

export const getGeminiCropAdvisor = async (apiKey, input) => {
  const systemInstruction = `
    You are the AgriSathi AI Crop Advisor Agent.
    Provide a list of the top 3 crops suitable for the input state, district, soil, and season.
    You must output a single JSON array containing exactly 3 objects.
    
    The JSON structure MUST be an array matching:
    [
      { "name": "Crop 1", "suitability": 95, "yield": "12-15 q/acre", "water": "Medium", "profit": "High", "rank": 1 },
      { "name": "Crop 2", "suitability": 88, "yield": "8-10 q/acre", "water": "Low", "profit": "Medium", "rank": 2 },
      { "name": "Crop 3", "suitability": 78, "yield": "18-20 q/acre", "water": "High", "profit": "Medium", "rank": 3 }
    ]
  `;

  const userPrompt = `
    Input: State: ${input.state}, District: ${input.district}, Soil Type: ${input.soilType}, Season: ${input.season}
  `;

  return await queryGemini(apiKey, systemInstruction, userPrompt);
};

export const getGeminiDiseaseDiagnosis = async (apiKey, input) => {
  const systemInstruction = `
    You are the AgriSathi AI Disease Detection Agent.
    Diagnose the plant leaf disease.
    You must output a single JSON object.
    
    The JSON structure MUST match:
    {
      "diseaseName": "Name of Disease (or Healthy)",
      "confidenceScore": 95,
      "severityLevel": "Low/Moderate/Severe",
      "symptoms": "Detailed symptoms of the disease observed.",
      "treatmentPlan": [
        "Actionable treatment step 1 (including specific chemical dosage/organic alternatives)",
        "Actionable treatment step 2"
      ],
      "preventionSteps": [
        "Preventive measure 1",
        "Preventive measure 2"
      ]
    }
  `;

  const userPrompt = `
    Input image file hint: ${input.filename}.
    Identify the disease from this file (e.g. if name is rust_leaf.png, it is Rust. If blight_leaf.png, it is Early Blight. Otherwise, analyze typical diseases or return Healthy).
  `;

  return await queryGemini(apiKey, systemInstruction, userPrompt);
};

export const getGeminiWeatherDecisions = async (apiKey, location) => {
  const systemInstruction = `
    You are the AgriSathi AI Weather Intelligence Agent.
    Given the location, predict a 5-day weather schedule (invent realistic current season weather for the location).
    Create AGENTIC decisions based on the weather. Do not say "Rain expected". Say "Heavy rain expected. Postpone fertilizer/irrigation and clear drainage canals."
    You must output a single JSON object.
    
    The JSON structure MUST match:
    {
      "location": "Location Name",
      "currentTemp": 30,
      "currentHumidity": 80,
      "condition": "Cloudy/Sunny/Rainy",
      "alert": "Urgent weather alert or warnings",
      "forecast": [
        { "day": "Today", "temp": 32, "condition": "Sunny", "rainChance": 10 },
        { "day": "Tomorrow", "temp": 30, "condition": "Cloudy", "rainChance": 30 },
        { "day": "Day 3", "temp": 25, "condition": "Heavy Rain", "rainChance": 90 },
        { "day": "Day 4", "temp": 27, "condition": "Light Rain", "rainChance": 50 },
        { "day": "Day 5", "temp": 29, "condition": "Sunny", "rainChance": 10 }
      ],
      "recommendations": [
        "Specific agentic action 1 based on rain/heat warnings",
        "Specific agentic action 2"
      ]
    }
  `;

  return await queryGemini(apiKey, systemInstruction, `Location: ${location}`);
};

export const getGeminiMarketPrices = async (apiKey, cropName) => {
  const systemInstruction = `
    You are the AgriSathi AI Market Intelligence Agent.
    Provide current market pricing, a 6-month historical price trend array, nearby mandi comparisons, and an agentic selling recommendation.
    You must output a single JSON object.
    
    The JSON structure MUST match:
    {
      "crop": "Crop Name",
      "currentPrice": 2480,
      "unit": "Quintal (100 kg)",
      "chartData": [2100, 2150, 2200, 2180, 2350, 2480],
      "bestMandi": "Mandi Name (Price)",
      "profitabilityScore": 92,
      "recommendation": "Agentic selling advice. Give exact guidelines on how much to sell now vs store.",
      "otherMandis": [
        { "name": "Mandi A", "price": 2450, "distance": "15 km" },
        { "name": "Mandi B", "price": 2510, "distance": "20 km" }
      ]
    }
  `;

  return await queryGemini(apiKey, systemInstruction, `Crop: ${cropName}`);
};

export const getGeminiSchemes = async (apiKey, input) => {
  const systemInstruction = `
    You are the AgriSathi AI Government Scheme Agent.
    Match the farmer's demographic profile to relevant Indian agricultural welfare and support schemes.
    You must output a single JSON array of scheme objects.
    
    The JSON structure MUST be an array matching:
    [
      {
        "name": "Scheme Name",
        "eligibility": "Eligibility criteria",
        "benefits": "Key benefits and subsidies",
        "steps": [
          "Step 1 to apply",
          "Step 2 to apply"
        ],
        "documents": ["Required Document 1", "Required Document 2"]
      }
    ]
  `;

  const userPrompt = `
    Farmer profile: State: ${input.state}, Land size: ${input.landSize} acres, Farmer category: ${input.farmerType}
  `;

  return await queryGemini(apiKey, systemInstruction, userPrompt);
};
