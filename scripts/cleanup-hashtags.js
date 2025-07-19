const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupHashtags() {
  try {
    console.log('Starting hashtag cleanup...');

    // Get all hashtags
    const hashtags = await prisma.hashtag.findMany();
    console.log(`Found ${hashtags.length} total hashtags`);

    // Group by tag and find duplicates
    const tagGroups = {};
    hashtags.forEach(hashtag => {
      if (!tagGroups[hashtag.tag]) {
        tagGroups[hashtag.tag] = [];
      }
      tagGroups[hashtag.tag].push(hashtag);
    });

    let deletedCount = 0;

    // Delete duplicates
    for (const [tag, group] of Object.entries(tagGroups)) {
      if (group.length > 1) {
        console.log(`Found ${group.length} duplicates for tag: "${tag}"`);

        // Keep the first one, delete the rest
        for (let i = 1; i < group.length; i++) {
          await prisma.hashtag.delete({
            where: { id: group[i].id }
          });
          console.log(`Deleted duplicate: ${group[i].id}`);
          deletedCount++;
        }
      }
    }

    if (deletedCount === 0) {
      console.log('No duplicates found!');
    } else {
      console.log(`Cleanup completed! Deleted ${deletedCount} duplicate hashtags.`);
    }

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupHashtags()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });