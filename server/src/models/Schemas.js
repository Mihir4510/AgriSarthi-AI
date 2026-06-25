import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';

// Schemas
const UserProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  farmerType: { type: String, default: 'Small Holder' }
}, { timestamps: true });

const FarmDataSchema = new mongoose.Schema({
  location: { type: String, required: true },
  acres: { type: Number, required: true },
  soilType: { type: String, required: true },
  budget: { type: Number, required: true },
  waterLevel: { type: String, required: true },
  season: { type: String, required: true },
  goal: { type: String, required: true },
  recommendedCrop: { type: String },
  plan: { type: Object }
}, { timestamps: true });

const RecommendationsLogSchema = new mongoose.Schema({
  agentType: { type: String, required: true },
  input: { type: Object, required: true },
  output: { type: Object, required: true },
  mode: { type: String, default: 'Demo' }
}, { timestamps: true });

// Models
const UserProfileModel = mongoose.model('UserProfile', UserProfileSchema);
const FarmDataModel = mongoose.model('FarmData', FarmDataSchema);
const RecommendationsLogModel = mongoose.model('RecommendationsLog', RecommendationsLogSchema);

// Memory fallback store
const memoryStore = {
  userProfiles: [],
  farmData: [],
  logs: []
};

// Fail-safe helper functions
export const saveUserProfile = async (data) => {
  if (getDbStatus()) {
    return await UserProfileModel.create(data);
  } else {
    const record = { _id: `mem_user_${Date.now()}`, ...data, createdAt: new Date() };
    memoryStore.userProfiles.push(record);
    return record;
  }
};

export const saveFarmData = async (data) => {
  if (getDbStatus()) {
    return await FarmDataModel.create(data);
  } else {
    const record = { _id: `mem_farm_${Date.now()}`, ...data, createdAt: new Date() };
    memoryStore.farmData.push(record);
    return record;
  }
};

export const getFarmDataHistory = async () => {
  if (getDbStatus()) {
    return await FarmDataModel.find().sort({ createdAt: -1 }).limit(10);
  } else {
    return [...memoryStore.farmData].reverse().slice(0, 10);
  }
};

export const logRecommendation = async (agentType, input, output, mode) => {
  const logData = { agentType, input, output, mode };
  if (getDbStatus()) {
    try {
      return await RecommendationsLogModel.create(logData);
    } catch (e) {
      console.error('Error logging to DB:', e.message);
    }
  }
  // fallback
  const record = { _id: `mem_log_${Date.now()}`, ...logData, createdAt: new Date() };
  memoryStore.logs.push(record);
  return record;
};

export const getRecommendationsLog = async () => {
  if (getDbStatus()) {
    return await RecommendationsLogModel.find().sort({ createdAt: -1 }).limit(20);
  } else {
    return [...memoryStore.logs].reverse().slice(0, 20);
  }
};

export { UserProfileModel, FarmDataModel, RecommendationsLogModel };
