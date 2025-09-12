import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL || "");
        connection.isConnected = conn.connections[0]?.readyState;
        console.log("Connected to database");
    } catch (error) {
        console.log("Database connection failed", error);
        // In Next.js it is better not to exit the process; just throw
        throw error;
    }
}

export default dbConnect;
