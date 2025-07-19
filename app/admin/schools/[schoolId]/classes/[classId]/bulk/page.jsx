'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast' // Assuming you are using react-hot-toast for notifications

export default function BulkImportStudentsPage() {
  const params = useParams()
  const schoolId = params.schoolId
  const classId = params.classId

  const [isLoading, setIsLoading] = useState(false)
  const [classData, setClassData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Bulk import state: start with 5 empty student fields
  const [bulkStudents, setBulkStudents] = useState(
    Array(5)
      .fill(null)
      .map(() => ({ name: '', gender: '', rollNo: '', profileImage: null }))
  )

  // Fetch class data on component mount
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        // Check for cache-busting parameters
        const url = new URL(window.location.href)
        const noCache = url.searchParams.get('no-cache') === 'true'
        const classUpdated = url.searchParams.get('classUpdated') === 'true'

        // Clear cache if needed
        if (noCache || classUpdated) {
          localStorage.removeItem(`class:${schoolId}:${classId}`)
          localStorage.removeItem(`class:${schoolId}:${classId}:timestamp`)
        }

        const response = await fetch(
          `/api/schools/${schoolId}/classes/${classId}${noCache || classUpdated ? '?no-cache=true' : ''}`
        )
        const data = await response.json()
        if (data.success) {
          setClassData(data.class)
        } else {
          setErrorMessage(data.error || 'Failed to fetch class details')
        }
      } catch (error) {
        console.error('Error fetching class details:', error)
        setErrorMessage('Error fetching class details: ' + error.message)
      }
    }
    fetchClassData()
  }, [schoolId, classId])

  const handleInputChange = (index, field, value) => {
    const newStudents = [...bulkStudents]
    newStudents[index][field] = value
    setBulkStudents(newStudents)
  }

  const handleAddMoreFields = () => {
    const currentStudentsCount = bulkStudents.length
    const maxStudents = 1000
    const fieldsToAdd = Math.min(5, maxStudents - currentStudentsCount)

    if (fieldsToAdd > 0) {
      const newFields = Array(fieldsToAdd)
        .fill(null)
        .map(() => ({ name: '', gender: '', rollNo: '', profileImage: null }))
      setBulkStudents([...bulkStudents, ...newFields])
    }
  }

  const handleRemoveField = (index) => {
    const newStudents = bulkStudents.filter((_, i) => i !== index)
    setBulkStudents(newStudents)
  }

  const handleImageUpload = async (index, file) => {
    if (!file) return

    try {
      // First, get a signature from our API
      const signatureResponse = await fetch('/api/cloudinary/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: Math.round(new Date().getTime() / 1000),
        }),
      })

      const { signature, timestamp, apiKey } = await signatureResponse.json()

      // Create form data for Cloudinary upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', apiKey)
      formData.append('timestamp', timestamp)
      formData.append('signature', signature)

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (data.secure_url) {
        const newStudents = [...bulkStudents]
        newStudents[index].profileImage = data.secure_url
        setBulkStudents(newStudents)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  const handleRemoveImage = (index) => {
    const newStudents = [...bulkStudents]
    newStudents[index].profileImage = null
    setBulkStudents(newStudents)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    // Filter out rows with empty name, gender, or invalid rollNo
    const studentsToImport = bulkStudents.filter(
      (student) =>
        student.name.trim() !== '' &&
        student.gender !== '' &&
        student.rollNo !== '' &&
        !isNaN(parseInt(student.rollNo))
    )

    if (studentsToImport.length === 0) {
      setErrorMessage(
        'Please fill in at least one student row with all required fields (Name, Gender, Roll Number), and ensure Roll Number is a valid number.'
      )
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(
        `/api/schools/${schoolId}/classes/${classId}/students/bulk`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ students: studentsToImport, classId }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import students')
      }

      setSuccessMessage(
        `Successfully imported ${data.students.length} students.`
      )
      // Optionally reset form or redirect after successful import
      setBulkStudents(
        Array(5)
          .fill(null)
          .map(() => ({ name: '', gender: '', rollNo: '', profileImage: null }))
      )

      // Redirect back to the class details page after a short delay and force refresh
      setTimeout(() => {
        window.location.href = `/admin/schools/${schoolId}/classes/${classId}?no-cache=true`
      }, 1500) // Redirect after 1.5 seconds
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (!classData) {
    return <div className="p-6 text-center">Loading class information...</div>
  }

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumbs */}
      <div className="text-sm breadcrumbs">
        <ul className="flex items-center space-x-2 text-gray-600">
          <li>
            <Link href="/admin/schools" className="hover:underline">
              Schools
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <Link
              href={`/admin/schools/${schoolId}`}
              className="hover:underline"
            >
              {classData.school?.name}
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <Link
              href={`/admin/schools/${schoolId}/classes/${classId}`}
              className="hover:underline"
            >
              {classData.parentClass
                ? classData.parentClass.name
                : classData.name}
              {classData.section && ` (${classData.section})`}
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Bulk Import</span>
          </li>
        </ul>
      </div>
      {/* Class Header */}
      <div className="bg-white rounded-lg border p-6 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Bulk Import Students for{' '}
              {classData.parentClass
                ? classData.parentClass.name
                : classData.name}
              {classData.section && ` (${classData.section})`}
            </h1>
            <div className="mt-1 text-sm text-gray-600">
              School: {classData.school?.name} ({classData.school?.code})
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="rounded-md bg-blue-50 px-2.5 py-1.5 text-sm text-blue-700">
            Total Students: {classData.totalStudents || 0}
          </div>
          <div className="rounded-md bg-green-50 px-2.5 py-1.5 text-sm text-green-700">
            Boys: {classData.boys || 0}
          </div>
          <div className="rounded-md bg-purple-50 px-2.5 py-1.5 text-sm text-purple-700">
            Girls: {classData.girls || 0}
          </div>
          <div className="rounded-md bg-gray-100 px-2.5 py-1.5 text-sm text-gray-700">
            Start Roll No: {classData.startRollNumber}
          </div>
        </div>
      </div>
      {/* Bulk Import Form */}
      <div className="bg-white rounded-lg border p-6 shadow">
        {errorMessage && (
          <div className="p-4 mb-4 border border-red-200 rounded-md bg-red-50 text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-4 mb-4 border border-green-200 rounded-md bg-green-50 text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Student Name</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Roll Number</th>
                  <th className="px-4 py-2">Profile Image</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bulkStudents.map((student, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) =>
                          handleInputChange(index, 'name', e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter student name"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={student.gender}
                        onChange={(e) =>
                          handleInputChange(index, 'gender', e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Boy</option>
                        <option value="F">Girl</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={student.rollNo}
                        onChange={(e) =>
                          handleInputChange(index, 'rollNo', e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Roll Number"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          {student.profileImage ? (
                            <div className="relative w-10 h-10">
                              <img
                                src={student.profileImage}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              <img
                                src="/icons/girl.png"
                                alt="Default"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm">
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(index, e.target.files[0])
                            }
                          />
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {bulkStudents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bulkStudents.length < 1000 && ( // Show button only if max students not reached
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleAddMoreFields}
                className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
                disabled={isLoading || bulkStudents.length >= 1000}
              >
                Add Next 5 Students ({bulkStudents.length} / 1000)
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-md border px-4 py-2 text-sm font-medium mr-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? 'Importing...' : 'Import Students'}
            </button>
          </div>
        </form>
      </div>{' '}
      {/* Closing Bulk Import Form div */}
    </div>
  )
}
