const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateClassDuplicates() {
  console.log('🚀 Starting class duplication migration...')

  try {
    // Step 1: Get all classes and group by name
    const allClasses = await prisma.class.findMany({
      include: {
        students: true,
        messages: true,
        school: true,
      },
    })

    console.log(`📊 Found ${allClasses.length} total classes`)

    // Group classes by name
    const classesByName = {}
    allClasses.forEach((cls) => {
      if (!classesByName[cls.name]) {
        classesByName[cls.name] = []
      }
      classesByName[cls.name].push(cls)
    })

    let migratedCount = 0
    let createdTemplates = 0

    // Step 2: Process each class name group
    for (const [className, classes] of Object.entries(classesByName)) {
      console.log(
        `\n🔄 Processing "${className}" (${classes.length} instances)`
      )

      if (classes.length === 1) {
        // Single class - check if it should be a template
        const singleClass = classes[0]
        if (singleClass.isCommon && !singleClass.schoolId) {
          console.log(`   ✅ "${className}" is already a proper template`)
          continue
        } else if (!singleClass.isCommon && singleClass.schoolId) {
          console.log(
            `   ✅ "${className}" is already a proper school instance`
          )
          continue
        }
      }

      // Step 3: Find or create template class
      let templateClass = classes.find(
        (cls) => cls.isCommon === true && cls.schoolId === null
      )

      if (!templateClass) {
        // Create a new template class
        templateClass = await prisma.class.create({
          data: {
            name: className,
            isCommon: true,
            schoolId: null,
            parentClassId: null,
            totalStudents: 0,
            boys: 0,
            girls: 0,
            startRollNumber: 1,
          },
        })
        console.log(`   ✅ Created new template for "${className}"`)
        createdTemplates++
      } else {
        console.log(`   ✅ Using existing template for "${className}"`)
      }

      // Step 4: Update school-specific instances
      const schoolClasses = classes.filter((cls) => cls.id !== templateClass.id)

      for (const schoolClass of schoolClasses) {
        // Update to reference the template
        await prisma.class.update({
          where: { id: schoolClass.id },
          data: {
            parentClassId: templateClass.id,
            isCommon: false,
          },
        })

        console.log(
          `   🔗 Linked "${className}" in ${schoolClass.school?.name || 'Unknown School'} to template`
        )
        migratedCount++
      }
    }

    console.log(`\n🎉 Migration completed successfully!`)
    console.log(`📈 Created ${createdTemplates} new template classes`)
    console.log(
      `🔗 Migrated ${migratedCount} school classes to reference pattern`
    )

    // Step 5: Validation
    console.log('\n🔍 Validating migration...')
    const templateClasses = await prisma.class.count({
      where: { isCommon: true, schoolId: null },
    })

    const schoolInstanceClasses = await prisma.class.count({
      where: { isCommon: false, schoolId: { not: null } },
    })

    const orphanedClasses = await prisma.class.count({
      where: {
        isCommon: false,
        schoolId: { not: null },
        parentClassId: null,
      },
    })

    console.log(`📊 Validation Results:`)
    console.log(`   - Template classes: ${templateClasses}`)
    console.log(`   - School instance classes: ${schoolInstanceClasses}`)
    console.log(`   - Orphaned classes (should be 0): ${orphanedClasses}`)

    if (orphanedClasses > 0) {
      console.log(
        `⚠️  Warning: Found ${orphanedClasses} orphaned classes that need manual review`
      )
    } else {
      console.log(`✅ All classes properly linked!`)
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateClassDuplicates()
    .then(() => {
      console.log('✅ Migration script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error)
      process.exit(1)
    })
}

module.exports = { migrateClassDuplicates }
