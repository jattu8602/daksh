'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SchoolsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [schoolToDelete, setSchoolToDelete] = useState(null)
  const [schoolToEdit, setSchoolToEdit] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [schools, setSchools] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
  })

  // New school created info
  const [newSchool, setNewSchool] = useState(null)

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        // Check for cached data
        const cachedData = sessionStorage.getItem('allSchools')
        const cachedTimestamp = sessionStorage.getItem('allSchools:timestamp')
        const isCacheValid =
          cachedTimestamp && Date.now() - parseInt(cachedTimestamp) < 300000 // 5 min cache

        if (cachedData && isCacheValid) {
          console.log('Using cached data:', JSON.parse(cachedData))
          setSchools(JSON.parse(cachedData))
          setIsLoading(false)
          return
        }

        const response = await fetch('/api/schools', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('API Response:', data)

        if (data.success && Array.isArray(data.schools)) {
          console.log('Setting schools:', data.schools)
          setSchools(data.schools)
          // Cache the data
          sessionStorage.setItem('allSchools', JSON.stringify(data.schools))
          sessionStorage.setItem('allSchools:timestamp', Date.now().toString())
        } else {
          throw new Error(data.error || 'Invalid response format')
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
        setErrorMessage('Error fetching schools: ' + error.message)
        setSchools([]) // Reset schools on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [])

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
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create school')
      }

      // Show the new school info
      setNewSchool({
        id: data.school.id,
        name: data.school.name,
        code: data.school.code,
      })

      // Add the new school to the list
      setSchools([data.school, ...schools])

      setSuccessMessage('School created successfully')

      // Reset form
      setFormData({
        name: '',
        code: '',
        email: '',
        phone: '',
      })
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (school) => {
    setSchoolToEdit(school)
    setFormData({
      name: school.name,
      code: school.code,
      email: school.email || '',
      phone: school.phone || '',
    })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!schoolToEdit) return

    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch(`/api/schools/${schoolToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update school')
      }

      // Update the school in the list
      setSchools(
        schools.map((school) =>
          school.id === schoolToEdit.id ? data.school : school
        )
      )

      // Clear cache
      sessionStorage.removeItem('allSchools')
      sessionStorage.removeItem('allSchools:timestamp')

      toast.success('School updated successfully')
      setIsEditModalOpen(false)
      setSchoolToEdit(null)
      setFormData({
        name: '',
        code: '',
        email: '',
        phone: '',
      })
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (school) => {
    setSchoolToDelete(school)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!schoolToDelete) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/schools/${schoolToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete school')
      }

      // Remove the school from the list
      setSchools(schools.filter((s) => s.id !== schoolToDelete.id))

      // Clear cache
      sessionStorage.removeItem('allSchools')
      sessionStorage.removeItem('allSchools:timestamp')

      toast.success('School deleted successfully')
      setIsDeleteModalOpen(false)
      setSchoolToDelete(null)
    } catch (error) {
      toast.error(error.message || 'Failed to delete school')
    } finally {
      setIsLoading(false)
    }
  }

  // Memoize the filtered schools to prevent unnecessary re-renders
  const filteredSchools = useMemo(() => {
    console.log('Filtering schools:', schools)
    return schools.filter(
      (school) =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.email &&
          school.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (school.phone && school.phone.includes(searchTerm))
    )
  }, [schools, searchTerm])

  console.log('Current schools state:', schools)
  console.log('Filtered schools:', filteredSchools)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Schools
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none"
        >
          <span className="mr-2">+</span> Add School
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 dark:text-gray-500">🔍</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <tr
                    key={school.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {school.name}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {school.code}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {school.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {school.phone || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/schools/${school.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Classes
                        </Link>
                        <button
                          onClick={() => handleEditClick(school)}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(school)}
                          className="text-red-600 dark:text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                  >
                    No schools found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{' '}
            <span className="font-medium">{filteredSchools.length}</span> of{' '}
            <span className="font-medium">{schools.length}</span> schools
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && schoolToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow border border-gray-200 dark:border-gray-700">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Delete School
              </h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSchoolToDelete(null)
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete {schoolToDelete.name} (
                {schoolToDelete.code})? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSchoolToDelete(null)
                }}
                className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete School'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && schoolToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow border border-gray-200 dark:border-gray-700">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit School
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setSchoolToEdit(null)
                  setErrorMessage('')
                  setSuccessMessage('')
                  setFormData({
                    name: '',
                    code: '',
                    email: '',
                    phone: '',
                  })
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 rounded bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-600 dark:text-green-400">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  School Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter school name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  School Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="e.g., SCH001"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter school email"
                />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter school phone number"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setSchoolToEdit(null)
                    setErrorMessage('')
                    setSuccessMessage('')
                    setFormData({
                      name: '',
                      code: '',
                      email: '',
                      phone: '',
                    })
                  }}
                  className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-black dark:bg-white px-3 py-2 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update School'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow border border-gray-200 dark:border-gray-700">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New School
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  setNewSchool(null)
                  setErrorMessage('')
                  setSuccessMessage('')
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 rounded bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-600 dark:text-green-400">
                {successMessage}
              </div>
            )}

            {newSchool ? (
              <div className="mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-sm">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  School Created Successfully
                </h3>
                <p className="text-gray-900 dark:text-white">
                  <span className="font-medium">Name:</span> {newSchool.name}
                </p>
                <p className="text-gray-900 dark:text-white">
                  <span className="font-medium">Code:</span> {newSchool.code}
                </p>
                <div className="mt-4 flex justify-center">
                  <Link
                    href={`/admin/schools/${newSchool.id}`}
                    className="rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                  >
                    Add Classes to This School
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    School Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter school name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    School Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="e.g., SCH001"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter school email"
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter school phone number"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-black dark:bg-white px-3 py-2 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Add School'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
