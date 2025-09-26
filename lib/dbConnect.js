import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. Set it in your environment variables.');
    throw new Error('MONGODB_URI is not set. Set it in your environment variables.');
  }
  
  console.log('Connecting to MongoDB:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
  
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB connected successfully');
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
