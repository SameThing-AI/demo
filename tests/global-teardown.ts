/**
 * Global Test Teardown
 * Runs after all tests to clean up test environment
 */

async function globalTeardown() {
  console.log('🧹 Starting global test teardown...')
  
  // Clean up test database
  try {
    const { MongoClient } = require('mongodb')
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    
    const db = client.db()
    await db.dropDatabase()
    await client.close()
    
    console.log('✅ Test database dropped')
  } catch (error) {
    console.warn('⚠️ Could not clean up test database:', error.message)
  }
  
  console.log('✅ Global test teardown complete')
}

module.exports = globalTeardown
