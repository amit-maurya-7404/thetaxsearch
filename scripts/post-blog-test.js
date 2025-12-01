import dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/.env.local' })

const port = process.env.NEXT_PORT || 3001
const url = `http://localhost:${port}/api/blog`

const payload = {
  title: 'API Mongo Test ' + Date.now(),
  slug: 'api-mongo-test-' + Date.now(),
  description: 'Testing POST to /api/blog using MongoDB',
  content: 'This is a test content for MongoDB API integration.',
  tags: 'test'
}

async function run() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const text = await res.text()
    console.log('Status:', res.status)
    console.log('Response:', text)
  } catch (err) {
    console.error('Request failed:', err)
  }
}

run()
