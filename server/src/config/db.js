import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isDbConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrisathi';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    isDbConnected = true;
  } catch (error) {
    console.error(`[DATABASE WARNING] MongoDB connection failed: ${error.message}`);
    console.log(`[DATABASE] Falling back to In-Memory / File-based Storage (Demo Mode).`);
    isDbConnected = false;
  }
};

export const getDbStatus = () => isDbConnected;
export default connectDB;
