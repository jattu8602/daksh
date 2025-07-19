'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export default function ClassesPage() {
  const params = useParams()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Add state for all global classes
  const [allClasses, setAllClasses] = useState([])

  // Updated form state to match global class system
  const [formData, setFormData] = useState({
    classId: '',
    startRollNumber: '1',
    section: '',
  })

  // Fetch all global classes on component mount
  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await fetch('/api/classes')
        const data = await response.json()
        if (data.success) {
          setAllClasses(data.classes)
        }
      } catch (error) {
        console.error('Error fetching global classes:', error)
      }
    }
    fetchAllClasses()
  }, [])

  useEffect(() => {
    fetchClasses()
  }, [params.schoolId])

  const fetchClasses = async () => {
    try {
      const response = await fetch(`/api/schools/${params.schoolId}/classes`)
      const data = await response.json()
      if (data.success) {
        setClasses(data.classes)
      } else {
        setErrorMessage(data.error || 'Failed to fetch classes')
      }
    } catch (error) {
      setErrorMessage('Something went wrong')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/classes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: formData.classId,
          schoolId: params.schoolId,
          startRollNumber: formData.startRollNumber,
          section: formData.section.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create class')
      }

      toast.success('Class created successfully')
      setFormData({
        classId: '',
        startRollNumber: '1',
        section: '',
      })
      fetchClasses()
      setIsAddModalOpen(false)
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Classes</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
        >
          <span className="mr-2">+</span> Add Class
        </button>
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">Class Type</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Total Students</th>
                <th className="px-4 py-3">Boys</th>
                <th className="px-4 py-3">Girls</th>
                <th className="px-4 py-3">Start Roll No.</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <tr key={cls.id} className="border-b">
                    <td className="px-4 py-3 font-medium">
                      {cls.parentClass ? cls.parentClass.name : cls.name}
                      {cls.section && ` (${cls.section})`}
                    </td>
                    <td className="px-4 py-3">{cls.section || '-'}</td>
                    <td className="px-4 py-3">{cls.totalStudents || 0}</td>
                    <td className="px-4 py-3">{cls.boys || 0}</td>
                    <td className="px-4 py-3">{cls.girls || 0}</td>
                    <td className="px-4 py-3">{cls.startRollNumber || 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/schools/${params.schoolId}/classes/${cls.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View Students
                        </Link>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                        <button className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No classes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-medium">{filteredClasses.length}</span> of{' '}
            <span className="font-medium">{classes.length}</span> classes
          </p>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Class to School</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  setErrorMessage('')
                  setSuccessMessage('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-600">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <p>
                  Select a global class template to add to this school. You can
                  customize the section and starting roll number for this
                  school's instance.
                </p>
              </div>

              {/* Class Selection */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Select Global Class Template
                </label>
                <Select
                  name="classId"
                  value={formData.classId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, classId: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {allClasses.map((classOption) => (
                      <SelectItem key={classOption.id} value={classOption.id}>
                        {classOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Section Input */}
              <div className="mb-4">
                <Label htmlFor="section">Section (Optional)</Label>
                <Input
                  id="section"
                  name="section"
                  placeholder="e.g., A, B, Red, etc."
                  value={formData.section}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {/* Start Roll Number Input */}
              <div className="mb-4">
                <Label htmlFor="startRollNumber">Start Roll Number</Label>
                <input
                  type="number"
                  name="startRollNumber"
                  value={formData.startRollNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 101"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
