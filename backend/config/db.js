import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);

      // Handle connection errors after initial connect
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected. Mongoose will auto-reconnect.");
      });

      return; // Success — exit the retry loop
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`,
      );
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error("All MongoDB connection attempts failed. Exiting.");
        process.exit(1);
      }
    }
  }
};

export default connectDB;
