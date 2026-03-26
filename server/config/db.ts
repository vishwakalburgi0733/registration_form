import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from `server/.env` no matter where the process is started from.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI as string;

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }

    const conn = await mongoose.connect(uri);
    console.log('MongoDB Connected: localhost');
  } catch (error) {
    if (error instanceof Error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred during database connection.');
    }
    // Exit process with failure code
    process.exit(1);
  }
};

export default connectDB;
