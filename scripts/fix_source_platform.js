const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Use MongoDB's updateMany via Prisma's $runCommandRaw
  const result = await prisma.$runCommandRaw({
    update: "Video",
    updates: [
      {
        q: { sourcePlatform: null },
        u: { $set: { sourcePlatform: "unknown" } },
        multi: true
      }
    ]
  });
  console.log(`Matched: ${result.n}, Modified: ${result.nModified}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });