import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be set. Provide a MongoDB connection string.");
}

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI!);
  }
}

export * from "./schema";
