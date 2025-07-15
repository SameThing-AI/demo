import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn('Warning: MONGODB_URI environment variable is not defined')
}

// Check if the connection string is valid (not a placeholder)
const isPlaceholder = !MONGODB_URI || 
  MONGODB_URI.includes('your-mongodb-connection-string-here') ||
  MONGODB_URI.includes('mongodb://localhost:27017')

if (isPlaceholder) {
  console.warn('Warning: Using placeholder or local MongoDB connection string. Database operations will fail in production.')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  // Skip connection if using placeholder values
  if (isPlaceholder) {
    throw new Error('Database not configured. Please set a valid MONGODB_URI in .env.local')
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
