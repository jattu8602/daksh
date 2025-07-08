'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { debounce } from 'lodash'
import { useRouter, useSearchParams } from 'next/navigation'
import MentorCard from '@/app/components/admin/MentorCard'

export default function MentorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isAddingMentor, setIsAddingMentor] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mentors, setMentors] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isOrganic, setIsOrganic] = useState(true)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 21,
    total: 0,
    totalPages: 0,
  })

  // Get current page from URL parameters
  const getCurrentPageFromURL = () => {
    const page = searchParams.get('page')
    return page ? parseInt(page, 10) : 1
  }

  const [currentPage, setCurrentPage] = useState(getCurrentPageFromURL())

  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: '',
  })

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    profilePhoto: '',
    isOrganic: true,
    bio: '',
    skills: [],
    socialLinks: {},
    subject: '',
    language: '',
  })

  // New mentor created info (to show credentials)
  const [newMentor, setNewMentor] = useState(null)

  // Update URL with current page
  const updateURL = (page, search = searchTerm) => {
    const params = new URLSearchParams()
    if (page && page !== 1) {
      params.set('page', page.toString())
    }
    if (search) {
      params.set('search', search)
    }
    const newURL = params.toString()
      ? `?${params.toString()}`
      : '/admin/mentors'
    router.replace(newURL, { scroll: false })
  }

  // Fetch mentors
  const fetchMentors = async (page) => {
    const pageToFetch = page || currentPage
    try {
      const response = await fetch(
        `/api/mentor/list?page=${pageToFetch}&limit=${pagination.limit}&search=${searchTerm}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch mentors')
      }

      setMentors(data.mentors)
      setPagination(data.pagination)
      setCurrentPage(pageToFetch)

      // Update URL with current page
      updateURL(pageToFetch, searchTerm)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch mentors')
    }
  }

  // Initialize from URL parameters on component mount
  useEffect(() => {
    const urlPage = getCurrentPageFromURL()
    const urlSearch = searchParams.get('search') || ''

    setCurrentPage(urlPage)
    setSearchTerm(urlSearch)

    // Fetch with URL parameters
    fetchMentorsWithParams(urlPage, urlSearch)
  }, [])

  // Fetch mentors when search term changes (but not on initial load)
  useEffect(() => {
    const currentURLSearch = searchParams.get('search') || ''
    if (searchTerm !== currentURLSearch) {
      fetchMentors(1) // Reset to page 1 when searching
    }
  }, [searchTerm])

  // Helper function to fetch with specific parameters
  const fetchMentorsWithParams = async (page, search) => {
    try {
      const response = await fetch(
        `/api/mentor/list?page=${page}&limit=${pagination.limit}&search=${search}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch mentors')
      }

      setMentors(data.mentors)
      setPagination(data.pagination)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch mentors')
    }
  }

  // Add debounced username check
  const checkUsername = debounce(async (username) => {
    if (!username) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: '',
      })
      return
    }

    setUsernameStatus({
      checking: true,
      available: null,
      message: 'Checking username...',
    })

    try {
      const response = await fetch(
        `/api/mentor/check-username?username=${encodeURIComponent(username)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check username')
      }

      setUsernameStatus({
        checking: false,
        available: data.available,
        message: data.message,
      })
    } catch (error) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: error.message || 'Error checking username',
      })
    }
  }, 500)

  // Update handleInputChange to include username check
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Check username availability when username field changes
    if (name === 'username') {
      checkUsername(value)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Image size should be less than 5MB')
      return
    }

    setImageUploading(true)
    setImageUploadError('')
    setErrorMessage('')

    try {
      // Check if Cloudinary environment variables are set
      if (
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      ) {
        throw new Error(
          'Cloudinary configuration is missing. Please check your environment variables.'
        )
      }

      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      )

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataUpload,
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error?.message ||
            `Failed to upload image: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || 'Image upload failed')
      }

      setUploadedImage(data.secure_url)
      setFormData((prev) => ({
        ...prev,
        profilePhoto: data.secure_url,
      }))

      setImageUploadError('')
    } catch (error) {
      console.error('Image upload error:', error)
      setImageUploadError(
        error.message || 'Failed to upload image. Please try again.'
      )
      setUploadedImage(null)
      setFormData((prev) => ({
        ...prev,
        profilePhoto: '',
      }))
    } finally {
      setImageUploading(false)
    }
  }

  const validateForm = () => {
    const errors = []

    if (!formData.name.trim()) {
      errors.push('Name is required')
    }

    if (!formData.username.trim()) {
      errors.push('Username is required')
    }

    if (!formData.profilePhoto) {
      errors.push('Profile photo is required')
    }

    if (!formData.subject.trim()) {
      errors.push('Subject is required')
    }

    if (!formData.language.trim()) {
      errors.push('Language is required')
    }

    if (formData.isOrganic) {
      if (!formData.password) {
        errors.push('Password is required for organic mentors')
      }
      if (formData.password !== formData.confirmPassword) {
        errors.push('Passwords do not match')
      }
      if (formData.password && formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long')
      }
    }

    if (formData.username && !usernameStatus.available) {
      errors.push('Username is not available or is being checked')
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    // Validate form
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join('. '))
      setIsLoading(false)
      return
    }

    // Check if image is still uploading
    if (imageUploading) {
      setErrorMessage('Please wait for the image upload to complete')
      setIsLoading(false)
      return
    }

    try {
      let response, data
      if (formData.id) {
        // Editing existing mentor
        response = await fetch(`/api/mentor/${formData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        data = await response.json()
        if (!response.ok) {
          throw new Error(
            data.message || data.error || 'Failed to update mentor'
          )
        }
        setSuccessMessage('Mentor updated successfully')
        setIsAddingMentor(false)
        fetchMentors(currentPage)
      } else {
        // Creating new mentor
        response = await fetch('/api/mentor/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        data = await response.json()
        if (!response.ok) {
          throw new Error(
            data.message || data.error || 'Failed to create mentor'
          )
        }
        // Show the new mentor credentials
        setNewMentor({
          name: data.mentor.name,
          username: data.mentor.username,
          password: data.password,
          isOrganic: data.mentor.isOrganic,
        })
        fetchMentors(1) // Go to page 1 for new mentors since they'll appear at the top
        setSuccessMessage('Mentor created successfully')
      }
      // Reset form
      resetForm()
    } catch (error) {
      console.error('Submit error:', error)
      setErrorMessage(
        error.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      profilePhoto: '',
      isOrganic: true,
      bio: '',
      skills: [],
      socialLinks: {},
      subject: '',
      language: '',
    })
    setUploadedImage(null)
    setImageUploadError('')
    setUsernameStatus({
      checking: false,
      available: null,
      message: '',
    })
  }

  const handleCancel = () => {
    setIsAddingMentor(false)
    setNewMentor(null)
    setErrorMessage('')
    setSuccessMessage('')
    resetForm()
  }

  const handleEdit = (mentor) => {
    setIsAddingMentor(true)
    setFormData({
      ...mentor,
      id: mentor.id,
      password: '',
      confirmPassword: '',
    })
    setIsOrganic(mentor.isOrganic)
    setUploadedImage(mentor.profilePhoto)
  }

  const handleDelete = async (mentorId) => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const res = await fetch(`/api/mentor/${mentorId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to delete mentor')

      // If this was the last item on the current page and we're not on page 1, go back one page
      const remainingItems = mentors.length - 1
      if (remainingItems === 0 && currentPage > 1) {
        fetchMentors(currentPage - 1)
      } else {
        fetchMentors(currentPage)
      }
      setSuccessMessage('Mentor deleted successfully')
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete mentor')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = (mentor) => {
    // Placeholder for reset password functionality
    console.log('Reset password for:', mentor.username)
    // You can implement a modal or a separate page for this
    alert('Reset password functionality is not implemented yet.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAddingMentor ? (
        // List View
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Mentors</h1>
            <button
              onClick={() => setIsAddingMentor(true)}
              className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
            >
              <span className="mr-2">+</span> Add Mentor
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs mb-6">
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                updateURL(1, e.target.value) // Update URL immediately for search
              }}
              className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded bg-red-50 p-4 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded bg-green-50 p-4 text-sm text-green-600">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onResetPassword={handleResetPassword}
                currentPage={currentPage}
                searchTerm={searchTerm}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => fetchMentors(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded border disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page numbers */}
              <div className="flex space-x-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchMentors(pageNum)}
                        className={`px-3 py-2 rounded border text-sm ${
                          currentPage === pageNum
                            ? 'bg-black text-white border-black'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  }
                )}
              </div>

              <button
                onClick={() => fetchMentors(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-2 rounded border disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        // Add Mentor Form View
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {formData.id ? 'Edit Mentor' : 'Add New Mentor'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded bg-red-50 p-4 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 rounded bg-green-50 p-4 text-sm text-green-600">
                {successMessage}
              </div>
            )}

            {newMentor ? (
              <div className="mb-6 rounded-lg bg-blue-50 p-6 text-sm">
                <h3 className="mb-4 text-lg font-semibold">
                  New Mentor Credentials
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {newMentor.name}
                  </p>
                  <p>
                    <span className="font-medium">Username:</span>{' '}
                    {newMentor.username}
                  </p>
                  {newMentor.isOrganic && (
                    <p>
                      <span className="font-medium">Password:</span>{' '}
                      {newMentor.password}
                    </p>
                  )}
                </div>
                <p className="mt-4 text-xs text-gray-600">
                  Please save these credentials securely. The password cannot be
                  recovered later.
                </p>
                <button
                  onClick={() => setIsAddingMentor(false)}
                  className="mt-4 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Back to Mentors
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Mentor Type
                    </label>
                    <div className="flex items-center space-x-4 mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={isOrganic}
                          onChange={() => {
                            setIsOrganic(true)
                            setFormData((prev) => ({
                              ...prev,
                              isOrganic: true,
                            }))
                          }}
                          className="form-radio h-4 w-4 text-black"
                        />
                        <span className="ml-2">Organic</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={!isOrganic}
                          onChange={() => {
                            setIsOrganic(false)
                            setFormData((prev) => ({
                              ...prev,
                              isOrganic: false,
                            }))
                          }}
                          className="form-radio h-4 w-4 text-black"
                        />
                        <span className="ml-2">Inorganic</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Profile Photo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2 w-full"
                      disabled={imageUploading}
                    />

                    {imageUploading && (
                      <div className="mt-2 flex items-center text-blue-600 text-sm">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading image...
                      </div>
                    )}

                    {imageUploadError && (
                      <div className="mt-2 text-red-600 text-sm">
                        {imageUploadError}
                      </div>
                    )}

                    {uploadedImage && !imageUploading && (
                      <div className="mt-2 relative h-32 w-32">
                        <Image
                          src={uploadedImage}
                          alt="Uploaded"
                          fill
                          className="object-cover rounded"
                        />
                        <div className="absolute top-1 right-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            ✓ Uploaded
                          </span>
                        </div>
                      </div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter mentor's full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`mt-2 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                        usernameStatus.available === null
                          ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          : usernameStatus.available
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                          : 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      }`}
                      placeholder="Enter username"
                      required
                    />
                    {formData.username && (
                      <p
                        className={`mt-1 text-sm ${
                          usernameStatus.checking
                            ? 'text-gray-500'
                            : usernameStatus.available
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {usernameStatus.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter subject (e.g. Physics, Math)"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter language (e.g. English, Hindi)"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Bio (Optional)
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter mentor's bio"
                    rows="3"
                  />
                </div>

                {isOrganic && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter password (min 6 characters)"
                        required
                        minLength="6"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Confirm password"
                        required
                        minLength="6"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    disabled={isLoading || imageUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                    disabled={
                      isLoading ||
                      imageUploading ||
                      (formData.username && !usernameStatus.available) ||
                      !formData.profilePhoto
                    }
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {formData.id ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : formData.id ? (
                      'Update Mentor'
                    ) : (
                      'Add Mentor'
                    )}
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
