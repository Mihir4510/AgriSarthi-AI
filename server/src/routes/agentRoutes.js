import express from 'express';
import { runAgent } from '../services/orchestrator.js';
import { getFarmDataHistory, getRecommendationsLog, saveFarmData } from '../models/Schemas.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// Extract API Key and Demo overrides
const getRoutingParams = (req) => {
  const apiKey = req.headers['x-gemini-key'] || null;
  const forceDemo = req.headers['x-force-demo'] === 'true' || req.body.forceDemo === true;
  return { apiKey, forceDemo };
};

// 1. Farm Planner Agent
router.post('/farm-plan', async (req, res) => {
  try {
    const { apiKey, forceDemo } = getRoutingParams(req);
    const result = await runAgent('farm-plan', req.body, apiKey, forceDemo);
    
    // Save to FarmData history
    if (result.success && result.data) {
      await saveFarmData({
        location: req.body.location || 'Indore',
        acres: Number(req.body.acres || 2),
        soilType: req.body.soilType || 'Black',
        budget: Number(req.body.budget || 60000),
        waterLevel: req.body.waterLevel || 'medium',
        season: req.body.season || 'Kharif',
        goal: req.body.goal || 'Maximum Profit',
        recommendedCrop: result.data.recommendedCrop,
        plan: result.data
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Crop Advisor
router.post('/crop-advisor', async (req, res) => {
  try {
    const { apiKey, forceDemo } = getRoutingParams(req);
    const result = await runAgent('crop-advisor', req.body, apiKey, forceDemo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Disease Detection
router.post('/disease-detect', async (req, res) => {
  try {
    const { apiKey, forceDemo } = getRoutingParams(req);
    const result = await runAgent('disease-detect', req.body, apiKey, forceDemo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Weather Intelligence
router.post('/weather', async (req, res) => {
  try {
    const { apiKey, forceDemo } = getRoutingParams(req);
    const result = await runAgent('weather', req.body, apiKey, forceDemo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Market Intelligence
router.post('/market', async (req, res) => {
  try {
    const { apiKey, forceDemo } = getRoutingParams(req);
    const result = await runAgent('market', req.body, apiKey, forceDemo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Government Schemes
router.post('/schemes', async (req, res) => {
  try {
    const { apiKey, forceDemo } = getRoutingParams(req);
    const result = await runAgent('schemes', req.body, apiKey, forceDemo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// History & System Diagnostics
router.get('/history/farm-plans', async (req, res) => {
  try {
    const history = await getFarmDataHistory();
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/history/logs', async (req, res) => {
  try {
    const logs = await getRecommendationsLog();
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/db-status', (req, res) => {
  res.json({
    success: true,
    connected: getDbStatus(),
    timestamp: new Date()
  });
});

export default router;
