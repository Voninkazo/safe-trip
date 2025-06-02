import mongoose from "mongoose";

const MONGO_URI = import.meta.env.PUBLIC_MONGO_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.info("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export const db = mongoose.connection;
