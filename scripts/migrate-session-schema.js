// Migration script to update existing sessions for refresh token support
// Run this script after updating the Prisma schema

const { PrismaClient } = require('@prisma/client')
const { randomBytes } = require('crypto')

const prisma = new PrismaClient()

async function migrateSessionSchema() {
  try {
    console.log('Starting session schema migration...')

    // First, let's see how many existing sessions we have
    const existingSessions = await prisma.session.findMany()
    console.log(`Found ${existingSessions.length} existing sessions`)

    if (existingSessions.length === 0) {
      console.log('No existing sessions to migrate')
      return
    }

    // For safety, we'll delete all existing sessions
    // Users will need to log in again, but this ensures clean state
    console.log('Deleting existing sessions to ensure clean state...')
    await prisma.session.deleteMany({})
    console.log('All existing sessions deleted')

    console.log('Session schema migration completed successfully!')
    console.log(
      'Users will need to log in again to create new sessions with refresh tokens'
    )
  } catch (error) {
    console.error('Error during migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateSessionSchema()
    .then(() => {
      console.log('Migration completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}

module.exports = { migrateSessionSchema }
