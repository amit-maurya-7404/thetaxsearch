import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thetaxsearch'

// Debug logging
if (typeof window === 'undefined') {
  console.log('🔍 MongoDB Connection Debug:')
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Not set')
  console.log('Using URI:', MONGODB_URI.substring(0, 50) + '...')
}

// NOTE: do NOT throw at import time if MONGODB_URI is missing —
// some build environments may import this file during prerender.
// Instead, callers should attempt to connect and handle errors.

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any).mongoose || { conn: null, promise: null }

export async function connect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts as any).then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise

  ;(global as any).mongoose = cached
  return cached.conn
}

export default connect
import { MongoClient, Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is not defined. Please add it to your .env.local file or Netlify environment variables. Get a free MongoDB connection at https://www.mongodb.com/cloud/atlas"
    )
  }

  try {
    console.log("🔄 Attempting MongoDB connection...")
    const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 })
    await client.connect()

    const db = client.db("thetaxsearch")

    cachedClient = client
    cachedDb = db

    console.log("✅ Connected to MongoDB successfully")
    return { client, db }
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:")
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    console.error("URI used:", mongoUri.substring(0, 50) + "...")
    throw error
  }
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase()
  return db
}
