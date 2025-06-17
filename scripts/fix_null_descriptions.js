const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log(
    'Starting script to update null descriptions using a raw query...'
  )
  try {
    const result = await prisma.$runCommandRaw({
      update: 'Video',
      updates: [
        {
          q: { description: null },
          u: { $set: { description: '' } },
          multi: true,
        },
      ],
    })

    if (result.nModified !== undefined) {
      console.log(`Successfully updated ${result.nModified} records.`)
    } else {
      console.log(
        'Raw command executed, but "nModified" was not returned. Check your database to confirm changes.',
        result
      )
    }
  } catch (error) {
    console.error('Error updating records with raw query:', error)
  } finally {
    await prisma.$disconnect()
    console.log('Script finished and disconnected from the database.')
  }
}

main()
