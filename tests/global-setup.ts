/**
 * Global Test Setup
 * Runs before all tests to set up test environment
 */

async function globalSetup() {
  console.log('🚀 Starting global test setup...')
  
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
  process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only'
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/test-ai-hiring'
  
  // Initialize test database if needed
  try {
    const { MongoClient } = require('mongodb')
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    
    // Clean test database
    const db = client.db()
    const collections = await db.listCollections().toArray()
    
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({})
    }
    
    await client.close()
    console.log('✅ Test database cleaned')
  } catch (error) {
    console.warn('⚠️ Could not clean test database:', error.message)
  }
  
  console.log('✅ Global test setup complete')
}

module.exports = globalSetup
