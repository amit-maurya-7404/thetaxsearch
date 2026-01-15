// Simple MongoDB connectivity test script
// Usage: node scripts/test-mongo.js
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config({ path: process.cwd() + '/.env.local' })

const uri = process.env.NEXT_PUBLIC_MONGODB_URL || process.env.MONGODB_URI

async function main() {
  if (!uri) {
    console.error('NEXT_PUBLIC_MONGODB_URL is not set in environment (check .env.local)')
    process.exit(2)
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })

  try {
    await client.connect()
    // Ping the server
    const admin = client.db().admin()
    const info = await admin.ping()
    console.log('MongoDB connection successful:', info)
    // Optionally list databases
    const dbs = await client.db().admin().listDatabases()
    console.log('Databases:', dbs.databases.map(d => d.name).join(', '))
    process.exit(0)
  } catch (err) {
    console.error('MongoDB connection failed:')
    console.error(err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main()
