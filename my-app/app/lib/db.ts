import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!; // Defina essa variável no arquivo .env

if (!MONGODB_URI) {
  throw new Error("Por favor, defina a variável MONGODB_URI no arquivo .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
