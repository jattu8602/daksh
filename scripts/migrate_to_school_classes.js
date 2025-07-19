const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateToSchoolClasses() {
  console.log('Starting migration to separate SchoolClass table...');

  try {
    // Step 1: Find all classes that have a schoolId (these are school-specific classes)
    const schoolSpecificClasses = await prisma.class.findMany({
      where: {
        schoolId: { not: null }
      },
      include: {
        school: true
      }
    });

    console.log(`Found ${schoolSpecificClasses.length} school-specific classes to migrate`);

    if (schoolSpecificClasses.length === 0) {
      console.log('No school-specific classes found to migrate.');
      return;
    }

    // Step 2: For each school-specific class, find or create the corresponding common class
    for (const schoolClass of schoolSpecificClasses) {
      console.log(`Processing: ${schoolClass.name} (School: ${schoolClass.school?.name})`);

      // Find the common class with the same name (without section)
      let commonClassName = schoolClass.name;
      if (schoolClass.section) {
        // Remove section from name to find the base common class
        commonClassName = schoolClass.name.replace(` ${schoolClass.section}`, '');
      }

      let commonClass = await prisma.class.findFirst({
        where: {
          name: commonClassName,
          schoolId: null // Ensure it's a common class
        }
      });

      // If common class doesn't exist, create it
      if (!commonClass) {
        console.log(`Creating common class: ${commonClassName}`);
        commonClass = await prisma.class.create({
          data: {
            name: commonClassName,
            startRollNumber: 1
          }
        });
      }

      // Step 3: Create the new SchoolClass record
      const newSchoolClass = await prisma.schoolClass.create({
        data: {
          name: schoolClass.name,
          schoolId: schoolClass.schoolId,
          commonClassId: commonClass.id,
          startRollNumber: schoolClass.startRollNumber,
          section: schoolClass.section
        }
      });

      console.log(`Created SchoolClass: ${newSchoolClass.name} (ID: ${newSchoolClass.id})`);

      // Step 4: Update all students to reference the new SchoolClass
      const students = await prisma.student.findMany({
        where: {
          classId: schoolClass.id
        }
      });

      for (const student of students) {
        await prisma.student.update({
          where: { id: student.id },
          data: {
            classId: null,
            schoolClassId: newSchoolClass.id
          }
        });
      }

      // Step 5: Update all messages to reference the new SchoolClass
      const messages = await prisma.message.findMany({
        where: {
          classId: schoolClass.id
        }
      });

      for (const message of messages) {
        await prisma.message.update({
          where: { id: message.id },
          data: {
            classId: null,
            schoolClassId: newSchoolClass.id
          }
        });
      }

      console.log(`Updated ${students.length} students and ${messages.length} messages`);
    }

    console.log('Migration completed successfully!');
    console.log('Note: You may now want to delete the old school-specific classes from the Class table');
    console.log('Run: DELETE FROM Class WHERE schoolId IS NOT NULL');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateToSchoolClasses()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });