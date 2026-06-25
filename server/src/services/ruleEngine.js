// Expert Agricultural Rule Database

export const getFarmPlan = (input) => {
  const { location = 'Indore', acres = 2, soilType = 'Black', budget = 60000, waterLevel = 'medium', season = 'Kharif', goal = 'Maximum Profit' } = input;

  let crop = 'Soybean';
  let reasoning = 'Soybean matches the nutrient-rich black soil profile of Indore and fits your Kharif budget. It offers nitrogen fixation benefits to the soil and has a high market demand.';
  let yieldMin = 8; // quintals per acre
  let yieldMax = 12;
  let pricePerQuintal = 4800;
  let fertilizerCostRatio = 0.25;
  let seedCostRatio = 0.20;
  let irrigationCostRatio = 0.15;
  let laborCostRatio = 0.40;

  // Decide based on inputs
  if (season.toLowerCase() === 'rabi') {
    if (soilType.toLowerCase() === 'black' || soilType.toLowerCase() === 'clay') {
      crop = 'Wheat (Sharbati)';
      reasoning = 'Wheat is the premier Rabi crop for Central India. Black soil retains moisture from the monsoon, reducing irrigation needs and maximizing protein content.';
      yieldMin = 18;
      yieldMax = 24;
      pricePerQuintal = 2600;
    } else {
      crop = 'Gram (Chickpea)';
      reasoning = 'Gram thrives on residual moisture in lighter soils. It requires minimal water and fits perfectly within your low budget and Rabi temperature curves.';
      yieldMin = 6;
      yieldMax = 9;
      pricePerQuintal = 5300;
    }
  } else if (season.toLowerCase() === 'summer') {
    crop = 'Moong Dal (Green Gram)';
    reasoning = 'Moong is a short-duration summer pulse (65 days) that fits water-saving goals and acts as green manure. It has high heat tolerance.';
    yieldMin = 4;
    yieldMax = 6;
    pricePerQuintal = 7500;
    irrigationCostRatio = 0.35; // summer needs more water
  } else {
    // Kharif default decisions
    if (soilType.toLowerCase() === 'red' || soilType.toLowerCase() === 'sandy') {
      crop = 'Groundnut';
      reasoning = 'Sandy and red soils provide the loose texture needed for groundnut pod penetration. It has low nitrogen requirements and high oil yield premium.';
      yieldMin = 10;
      yieldMax = 14;
      pricePerQuintal = 6500;
    } else if (soilType.toLowerCase() === 'black' && waterLevel.toLowerCase() === 'high' && goal.toLowerCase().includes('profit')) {
      crop = 'Cotton (Bt)';
      reasoning = 'Bt Cotton yields extremely high profits under deep black soil with good drainage and higher moisture. Fits your budget and farming goal.';
      yieldMin = 12;
      yieldMax = 18;
      pricePerQuintal = 7200;
      fertilizerCostRatio = 0.30;
      laborCostRatio = 0.45;
    }
  }

  // Calculate financials based on acres and budget
  const avgYield = (yieldMin + yieldMax) / 2;
  const totalProduction = avgYield * acres;
  const expectedRevenue = totalProduction * pricePerQuintal;
  
  // Distribute costs
  const maxExpenses = budget * 0.9; // keep 10% safety margin
  const costs = {
    seeds: Math.round(maxExpenses * seedCostRatio),
    fertilizers: Math.round(maxExpenses * fertilizerCostRatio),
    irrigation: Math.round(maxExpenses * irrigationCostRatio),
    labor: Math.round(maxExpenses * laborCostRatio)
  };
  const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const expectedProfit = expectedRevenue - totalCost;

  // Generate week-by-week strategy
  const actionPlan = [
    { week: 1, title: 'Land Preparation', desc: 'Deep plough the land. Apply 5-10 tons of Farm Yard Manure (FYM) per acre to improve organic matter.' },
    { week: 2, title: 'Seed Selection & Treatment', desc: `Procure certified seeds. Treat seeds with Trichoderma (10g/kg seed) to prevent seed-borne diseases.` },
    { week: 3, title: 'Sowing & Pre-emergence Herbicide', desc: `Sow at depth of 3-5 cm. Apply Pendimethalin within 24 hours of sowing to control initial weeds.` },
    { week: 4, title: 'First Irrigation & Inspection', desc: 'Inspect germination density. Perform light gap-filling if patches are bare.' },
    { week: 5, title: 'First Fertilizer Dose', desc: 'Apply first split of Nitrogen/Urea. Ensure soil is moist; avoid application if heavy rain is expected in 24 hours.' },
    { week: 6, title: 'Weeding & Aeration', desc: 'Perform manual weeding or apply post-emergence herbicide. Clear drainage furrows.' },
    { week: 7, title: 'Pest Scouting', desc: 'Monitor leaf status for caterpillars or aphids. Install yellow sticky traps (10 per acre).' },
    { week: 8, title: 'Pod/Grain Development Care', desc: 'Critical moisture stage. If rains fail, provide supplemental irrigation. Spray neem seed kernel extract if pests cross thresholds.' },
    { week: 9, title: 'Pre-Harvest Monitoring', desc: 'Stop irrigation. Monitor moisture content in pods/grains. Prepare clean storage sacks.' },
    { week: 10, title: 'Harvesting & Curing', desc: 'Harvest during dry sunny days. Cure crops in sun for 3-4 days before sending to mandi.' }
  ];

  return {
    recommendedCrop: crop,
    reasoning,
    acres,
    soilType,
    season,
    goal,
    yieldEstimate: `${yieldMin} - ${yieldMax} quintals/acre`,
    expectedYieldTotal: `${Math.round(yieldMin * acres)} - ${Math.round(yieldMax * acres)} quintals`,
    financials: {
      expectedRevenue,
      totalCost,
      expectedProfit,
      costBreakdown: costs
    },
    actionPlan,
    risks: {
      weather: 'Monsoon delays or excessive dry spells during pod filling stage.',
      pest: 'Leaf rollers, aphids, or wilt disease if humidity stays above 85%.',
      soil: 'Waterlogging in heavy clay soils. Ensure raised bed cultivation if drainage is poor.'
    },
    checklist: [
      { id: 'c1', task: 'Source certified seed variety from licensed local cooperative.', done: false },
      { id: 'c2', task: 'Conduct soil pH and nutrient test before sowing.', done: false },
      { id: 'c3', task: 'Check local weather forecast to time sowing after the first rain.', done: false },
      { id: 'c4', task: 'Setup drainage trenches at the farm boundaries.', done: false }
    ]
  };
};

export const getCropAdvisor = (input) => {
  const { state = 'Madhya Pradesh', district = 'Indore', soilType = 'Black', season = 'Kharif' } = input;
  
  if (season.toLowerCase() === 'rabi') {
    return [
      { name: 'Wheat (Sharbati)', suitability: 95, yield: '18-22 q/acre', water: 'Medium', profit: 'High', rank: 1 },
      { name: 'Chickpea (Gram)', suitability: 88, yield: '7-9 q/acre', water: 'Low', profit: 'Medium-High', rank: 2 },
      { name: 'Mustard', suitability: 78, yield: '6-8 q/acre', water: 'Low', profit: 'Medium', rank: 3 }
    ];
  } else if (season.toLowerCase() === 'summer') {
    return [
      { name: 'Green Gram (Moong)', suitability: 92, yield: '4-6 q/acre', water: 'Low', profit: 'Medium-High', rank: 1 },
      { name: 'Sesame', suitability: 82, yield: '2-3 q/acre', water: 'Low', profit: 'Medium', rank: 2 },
      { name: 'Summer Maize', suitability: 70, yield: '15-18 q/acre', water: 'High', profit: 'Medium', rank: 3 }
    ];
  } else {
    // Kharif default
    if (soilType.toLowerCase() === 'red') {
      return [
        { name: 'Groundnut', suitability: 94, yield: '12-15 q/acre', water: 'Medium', profit: 'High', rank: 1 },
        { name: 'Maize', suitability: 85, yield: '16-20 q/acre', water: 'Medium', profit: 'Medium', rank: 2 },
        { name: 'Ragi (Finger Millet)', suitability: 80, yield: '10-12 q/acre', water: 'Low', profit: 'Medium', rank: 3 }
      ];
    } else {
      return [
        { name: 'Soybean', suitability: 94, yield: '9-11 q/acre', water: 'Medium', profit: 'High', rank: 1 },
        { name: 'Cotton (Bt)', suitability: 90, yield: '12-16 q/acre', water: 'High', profit: 'High', rank: 2 },
        { name: 'Pigeon Pea (Tur)', suitability: 82, yield: '5-7 q/acre', water: 'Low', profit: 'Medium-High', rank: 3 }
      ];
    }
  }
};

export const getDiseaseDiagnosis = (filename) => {
  const normFile = filename ? filename.toLowerCase() : '';
  
  if (normFile.includes('rust')) {
    return {
      diseaseName: 'Common Leaf Rust (Puccinia sorghi)',
      confidenceScore: 94,
      severityLevel: 'Moderate',
      symptoms: 'Elongated golden-brown to powdery-orange pustules on both upper and lower leaf surfaces. Yellow halos surrounding pustules, leading to premature leaf drying.',
      treatmentPlan: [
        'Apply Propiconazole 25% EC (200 ml/acre) mixed in 200 liters of water at the first sign of pustules.',
        'Apply spray of Neem Oil (1500 ppm) at 5ml/liter of water as an organic control.'
      ],
      preventionSteps: [
        'Plant rust-resistant seed hybrids.',
        'Practice proper crop rotation with non-host leguminous crops.',
        'Destroy infected crop residues after harvest to prevent spores from overwintering.'
      ]
    };
  } else if (normFile.includes('blight')) {
    return {
      diseaseName: 'Early Blight (Alternaria solani)',
      confidenceScore: 91,
      severityLevel: 'Severe',
      symptoms: 'Concentric dark rings (target board spots) forming on older leaves first. Leaves turn chlorotic (yellow) and drop off, reducing active photosynthesis.',
      treatmentPlan: [
        'Spray Mancozeb 75% WP (600g/acre) or Copper Oxychloride 50% WP (500g/acre) to arrest disease progression.',
        'Prune lower leaves that touch the soil to prevent soil-to-leaf spore splash.'
      ],
      preventionSteps: [
        'Implement drip irrigation to keep leaf canopy dry.',
        'Maintain row spacing of 90cm to maximize airflow.',
        'Apply straw mulching to act as a physical barrier for soil pathogens.'
      ]
    };
  } else {
    // healthy
    return {
      diseaseName: 'Healthy Leaf - No Pathogens Detected',
      confidenceScore: 98,
      severityLevel: 'None',
      symptoms: 'Uniform green coloration, firm turgor pressure, clean leaf margins, and zero lesions/spots observed.',
      treatmentPlan: [
        'No chemical treatments required.',
        'Continue regular monitoring once every 5 days.'
      ],
      preventionSteps: [
        'Maintain balanced N-P-K fertilizer application to prevent nutrient stress.',
        'Ensure optimum watering schedules matching weather guidelines.'
      ]
    };
  }
};

export const getWeatherDecisions = (location = 'Indore') => {
  // Simulating weather forecast
  const currentTemp = 29;
  const currentHumidity = 78;
  const alertText = 'Heavy rain (45mm) forecast in 48 hours. Risk of localized waterlogging.';
  
  const forecast = [
    { day: 'Today', temp: 31, condition: 'Sunny', rainChance: 10 },
    { day: 'Tomorrow', temp: 30, condition: 'Cloudy', rainChance: 40 },
    { day: 'Wed (Rain)', temp: 26, condition: 'Heavy Rain', rainChance: 90 },
    { day: 'Thu', temp: 27, condition: 'Light Showers', rainChance: 60 },
    { day: 'Fri', temp: 29, condition: 'Partly Cloudy', rainChance: 25 }
  ];

  const recommendations = [
    'Postpone any urea/fertilizer application today. Heavy rain on Wednesday will wash it away, causing economic loss and groundwater leaching.',
    'Postpone scheduled irrigation today. Conserve water and fuel as soil profile will be fully saturated in 48 hours.',
    'Check farm drainage channels immediately. Clear out silt, weeds, and debris to ensure runoff water exits without pooling.',
    'If crops are already harvested and curing in the field, move them to a dry, covered shed today to prevent rot.'
  ];

  return {
    location,
    currentTemp,
    currentHumidity,
    condition: 'Cloudy',
    alert: alertText,
    forecast,
    recommendations
  };
};

export const getMarketPrices = (cropName = 'Wheat') => {
  const normalizedCrop = cropName.toLowerCase();
  
  // Build chart history trend
  let prices = [2100, 2150, 2250, 2200, 2350, 2480];
  let currentPrice = 2480;
  let unit = 'Quintal (100 kg)';
  let recommendation = 'Mandi prices in Indore have spiked by 12% due to short supply. We advise selling 70% of your stock immediately. Store the remaining 30% to hedge against potential price increases next month.';
  let profitabilityScore = 90;
  let bestMandi = 'Indore Grain Mandi (₹2,510)';
  let otherMandis = [
    { name: 'Ujjain Mandi', price: 2470, distance: '55 km' },
    { name: 'Indore Mandi', price: 2510, distance: '12 km' },
    { name: 'Dewas Mandi', price: 2450, distance: '38 km' }
  ];

  if (normalizedCrop.includes('soy') || normalizedCrop.includes('bean')) {
    prices = [4200, 4300, 4150, 4400, 4650, 4800];
    currentPrice = 4800;
    recommendation = 'Soybean price is at a seasonal peak. However, moisture levels in late harvests are high. Sun-dry your harvest to under 10% moisture to receive the highest rate of ₹4,800 at Mandis.';
    profitabilityScore = 85;
    bestMandi = 'Dewas Mandi (₹4,850)';
    otherMandis = [
      { name: 'Indore Mandi', price: 4790, distance: '12 km' },
      { name: 'Dewas Mandi', price: 4850, distance: '38 km' },
      { name: 'Khargone Mandi', price: 4720, distance: '120 km' }
    ];
  } else if (normalizedCrop.includes('cotton')) {
    prices = [6800, 6900, 7100, 7000, 7150, 7200];
    currentPrice = 7200;
    recommendation = 'Cotton global rates are stable, but local arrivals are starting to surge. Rates will likely decrease by 5% in the next 15 days. Sell your picked cotton immediately to lock in current high prices.';
    profitabilityScore = 95;
    bestMandi = 'Khandwa Cotton Mandi (₹7,320)';
    otherMandis = [
      { name: 'Khandwa Mandi', price: 7320, distance: '130 km' },
      { name: 'Dhar Mandi', price: 7180, distance: '60 km' },
      { name: 'Indore Mandi', price: 7150, distance: '12 km' }
    ];
  }

  return {
    crop: cropName,
    currentPrice,
    unit,
    chartData: prices,
    bestMandi,
    profitabilityScore,
    recommendation,
    otherMandis
  };
};

export const getSchemes = (input) => {
  const { state = 'Madhya Pradesh', landSize = 2, farmerType = 'Small' } = input;
  const isEligibleForKisan = landSize <= 5; // PM-Kisan limits

  const matched = [
    {
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      eligibility: 'All farmers growing notified crops in notified areas, including tenant farmers.',
      benefits: 'Financial support against crop loss due to natural calamities. Insurance premium capped at just 2% for Kharif and 1.5% for Rabi crops.',
      steps: [
        'Apply online through PMFBY portal or visit the nearest common service center (CSC).',
        'Submit land holding documents, sowing certificate, and bank details.',
        'Pay premium before sowing deadline.'
      ],
      documents: ['Aadhaar Card', 'Land Record (Khasra/Khatauni)', 'Sowing Certificate', 'Cancelled Cheque']
    },
    {
      name: 'Subsidies for Micro-Irrigation (Drip/Sprinkler)',
      eligibility: 'Small and marginal farmers holding registered agricultural land.',
      benefits: '55% subsidy on drip and sprinkler systems installations for small/marginal farmers, 45% for other farmers.',
      steps: [
        'Submit application to the District Horticulture Officer.',
        'Empaneled agency visits farm for site survey and quote generation.',
        'Approval granted, system installed, subsidy disbursed to vendor directly.'
      ],
      documents: ['Land ownership papers', 'Soil/Water testing report', 'Aadhaar Card', 'Category certificate']
    }
  ];

  if (isEligibleForKisan) {
    matched.unshift({
      name: 'PM-KISAN Samman Nidhi',
      eligibility: 'Small and marginal landholder farmer families with total landholding up to 2 hectares (5 acres).',
      benefits: 'Direct income support of ₹6,000 per year in three equal installments of ₹2,000 directly into bank accounts.',
      steps: [
        'Self-register on PM-KISAN portal or visit local Patwari / CSC.',
        'Provide Aadhaar number and land records.',
        'Wait for state approval and DBT activation.'
      ],
      documents: ['Aadhaar Card', 'Land holding registry', 'Bank Passbook copy', 'Mobile Number linked to Aadhaar']
    });
  }

  return matched;
};
