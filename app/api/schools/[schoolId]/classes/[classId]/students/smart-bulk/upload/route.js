import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import ExcelJS from 'exceljs'
import { generateQRCode } from '@/lib/qrcode'
import { revalidatePath } from 'next/cache'

const validateStudentTemplate = (worksheet) => {
  const errors = []
  const headers = worksheet.getRow(1).values
  const expectedHeaders = ['Roll Number', 'Name', 'Gender']

  for (const expectedHeader of expectedHeaders) {
    if (!headers.includes(expectedHeader)) {
      errors.push(`Missing header: ${expectedHeader}`)
    }
  }

  return errors
}

export async function POST(request, { params }) {
  console.log('--- SMART BULK UPLOAD START ---')
  const { classId } = params
  let report = {
    totalRows: 0,
    successfulImports: 0,
    skippedRows: 0,
    errorList: [],
  }

  try {
    console.log('Step 1: Parsing form data...')
    const formData = await request.formData()
    const file = formData.get('file')
    console.log('Step 1: Success.')

    if (!file) {
      console.log('Error: No file found in form data.')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (
      file.type !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      console.log(`Error: Invalid file type: ${file.type}`)
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an .xlsx file.' },
        { status: 400 }
      )
    }

    console.log('Step 2: Reading file into buffer...')
    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = new ExcelJS.Workbook()
    console.log('Step 2: Success.')

    console.log('Step 3: Loading buffer into ExcelJS...')
    await workbook.xlsx.load(buffer)
    console.log('Step 3: Success.')

    const worksheet = workbook.worksheets[0]
    if (!worksheet) {
      console.log('Error: No worksheet found in the Excel file.')
      return NextResponse.json(
        { error: 'No worksheet found in the Excel file.' },
        { status: 400 }
      )
    }

    console.log('Step 4: Validating template headers...')
    const headerErrors = validateStudentTemplate(worksheet)
    if (headerErrors.length > 0) {
      console.log('Error: Invalid template headers.', headerErrors)
      return NextResponse.json(
        { error: 'Invalid template format', details: headerErrors },
        { status: 400 }
      )
    }
    console.log('Step 4: Success.')

    report.totalRows = worksheet.rowCount - 1 // Exclude header row
    const studentsToCreate = []

    console.log('Step 5: Fetching class data...')
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: { school: true, students: true },
    })
    console.log('Step 5: Success.')

    if (!classData) {
      console.log(`Error: Class with ID ${classId} not found.`)
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }
    const existingRollNumbers = classData.students.map((s) => s.rollNo)

    console.log('Step 6: Processing rows...')
    // Map header names to keys
    const headerRow = worksheet.getRow(1).values
    const keyMap = {}
    headerRow.forEach((value, index) => {
      if (value === 'Roll Number') keyMap.rollNumber = index
      if (value === 'Name') keyMap.name = index
      if (value === 'Gender') keyMap.gender = index
      if (value.startsWith('Image')) keyMap.image = index
    })

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i)
      const rollNumber = row.getCell(keyMap.rollNumber).value
      const name = row.getCell(keyMap.name).value
      const gender = row.getCell(keyMap.gender).value
      const imageUrl = keyMap.image
        ? row.getCell(keyMap.image).value?.text ||
          row.getCell(keyMap.image).value
        : null

      if (!name && !gender) {
        report.skippedRows++
        continue
      }

      // Validation
      if (!rollNumber || !Number.isInteger(rollNumber)) {
        report.errorList.push({
          row: i,
          error: 'Roll Number must be a valid integer.',
        })
        continue
      }
      if (!name || typeof name !== 'string' || name.trim() === '') {
        report.errorList.push({ row: i, error: 'Name is required.' })
        continue
      }
      if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
        report.errorList.push({
          row: i,
          error: "Gender must be one of 'Male', 'Female', or 'Other'.",
        })
        continue
      }
      if (
        existingRollNumbers.includes(rollNumber) ||
        studentsToCreate.some((s) => s.rollNo === rollNumber)
      ) {
        report.errorList.push({
          row: i,
          error: `Duplicate Roll Number: ${rollNumber}`,
        })
        continue
      }

      // Prepare student data
      const cleanName = name.toLowerCase().replace(/\s+/g, '')
      const username = `${cleanName}_${classData.school.code.toLowerCase()}_${classData.name
        .toLowerCase()
        .replace(/\s+/g, '')}_${rollNumber}`
      const password = Math.random().toString(36).substring(2, 15)
      const qrData = JSON.stringify({
        username,
        password,
        classId,
        rollNo: rollNumber,
      })
      const qrCode = await generateQRCode(qrData)

      const genderCode =
        gender === 'Male' ? 'M' : gender === 'Female' ? 'F' : 'O'

      studentsToCreate.push({
        rollNo: rollNumber,
        name: name,
        gender: genderCode,
        username,
        password,
        qrCode,
        profileImage: imageUrl || null,
        user: {
          create: {
            name,
            username,
            password,
            role: 'STUDENT',
            qrCode,
            profileImage: imageUrl || null,
          },
        },
        class: { connect: { id: classId } },
      })
    }
    console.log(
      `Step 6: Success. Found ${studentsToCreate.length} valid students to create.`
    )

    if (studentsToCreate.length > 0) {
      console.log('Step 7: Creating students in database...')
      const createdStudents = await prisma.$transaction(
        studentsToCreate.map((data) => prisma.student.create({ data }))
      )
      report.successfulImports = createdStudents.length
      console.log('Step 7: Success.')

      console.log('Step 8: Updating class stats...')
      const boysAdded = createdStudents.filter((s) => s.gender === 'M').length
      const girlsAdded = createdStudents.filter((s) => s.gender === 'F').length

      await prisma.class.update({
        where: { id: classId },
        data: {
          totalStudents: { increment: createdStudents.length },
          boys: { increment: boysAdded },
          girls: { increment: girlsAdded },
        },
      })
      console.log('Step 8: Success.')

      revalidatePath(`/admin/schools/${classData.schoolId}/classes/${classId}`)
    }

    console.log('--- SMART BULK UPLOAD END: SUCCESS ---')
    return NextResponse.json(report)
  } catch (error) {
    console.error('--- SMART BULK UPLOAD END: FAILED ---')
    console.error('Fatal error during student upload:', error)
    report.errorList.push({
      row: 'General',
      error: error.message || 'An unexpected error occurred.',
    })
    return NextResponse.json(report, { status: 500 })
  }
}
