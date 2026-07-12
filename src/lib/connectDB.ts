import mongoose from "mongoose";

const mongoDBUrl = process.env.MONGODB_URL;

if (!mongoDBUrl) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(mongoDBUrl).then((conn) => conn.connection);
    }
    const conn = await cached.promise;
    return conn;
  } catch (error) {
    console.log("Error in connecting to database", error);
    throw error;
  }
};

export default connectDb;