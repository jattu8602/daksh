const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupOldClasses() {
  try {
    console.log('Starting cleanup of old school-specific classes...');

    // Find all classes that have a schoolId (old school-specific classes)
    const oldSchoolClasses = await prisma.class.findMany({
      where: {
        schoolId: { not: null }
      }
    });

    console.log(`Found ${oldSchoolClasses.length} old school-specific classes to delete`);

    if (oldSchoolClasses.length === 0) {
      console.log('No old school-specific classes found to delete.');
      return;
    }

    // Delete each old school-specific class
    for (const oldClass of oldSchoolClasses) {
      await prisma.class.delete({
        where: { id: oldClass.id }
      });
      console.log(`Deleted old class: ${oldClass.name} (ID: ${oldClass.id})`);
    }

    console.log('Cleanup completed successfully!');
    console.log(`Deleted ${oldSchoolClasses.length} old school-specific classes`);

  } catch (error) {
    console.error('Cleanup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupOldClasses()
  .then(() => {
    console.log('Cleanup script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Cleanup script failed:', error);
    process.exit(1);
  });