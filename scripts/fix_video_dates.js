const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  // Fix updatedAt
  const fixUpdatedAt = await prisma.$runCommandRaw({
    update: "Video",
    updates: [
      {
        q: { updatedAt: null },
        u: { $set: { updatedAt: now } },
        multi: true
      }
    ]
  });
  // Fix createdAt
  const fixCreatedAt = await prisma.$runCommandRaw({
    update: "Video",
    updates: [
      {
        q: { createdAt: null },
        u: { $set: { createdAt: now } },
        multi: true
      }
    ]
  });
  console.log(`Fixed updatedAt: Matched ${fixUpdatedAt.n}, Modified ${fixUpdatedAt.nModified}`);
  console.log(`Fixed createdAt: Matched ${fixCreatedAt.n}, Modified ${fixCreatedAt.nModified}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });