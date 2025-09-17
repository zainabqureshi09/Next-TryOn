import mongoose from "mongoose";

// Global cache to prevent multiple connections during hot reload or lambda calls
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    const MONGODB_URI = process.env.MONGODB_URL as string | undefined;
    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URL environment variable is not defined");
      throw new Error("Please define the MONGODB_URL environment variable");
    }
    
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      };
      
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log("✅ Connected to MongoDB");
        return mongoose;
      }).catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        // Reset the promise so we can retry next time
        cached.promise = null;
        throw error;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      console.error("❌ Failed to establish MongoDB connection:", e);
      throw e;
    }

    return cached.conn;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    // Return null instead of throwing to prevent app crashes
    // The calling code should handle this case
    return null;
  }
}

export default dbConnect;
