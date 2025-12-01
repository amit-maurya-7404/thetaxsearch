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
      "MONGODB_URI is not defined. Please add it to your .env.local file. Get a free MongoDB connection at https://www.mongodb.com/cloud/atlas"
    )
  }

  try {
    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db("thetaxsearch")

    cachedClient = client
    cachedDb = db

    console.log("✅ Connected to MongoDB")
    return { client, db }
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error)
    throw error
  }
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase()
  return db
}
