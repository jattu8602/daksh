"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

export default function MentorsPage() {
  const [isAddingMentor, setIsAddingMentor] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isOrganic, setIsOrganic] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profilePhoto: "",
    isOrganic: true,
    bio: "",
    skills: [],
    socialLinks: {},
    subject: "",
    language: "",
  });

  // New mentor created info (to show credentials)
  const [newMentor, setNewMentor] = useState(null);

  // Fetch mentors
  const fetchMentors = async (page = 1) => {
    try {
      const response = await fetch(
        `/api/mentor/list?page=${page}&limit=${pagination.limit}&search=${searchTerm}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch mentors");
      }

      setMentors(data.mentors);
      setPagination(data.pagination);
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch mentors");
    }
  };

  // Fetch mentors on component mount and when search term changes
  useEffect(() => {
    fetchMentors(1);
  }, [searchTerm]);

  // Add debounced username check
  const checkUsername = debounce(async (username) => {
    if (!username) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: "",
      });
      return;
    }

    setUsernameStatus({
      checking: true,
      available: null,
      message: "Checking username...",
    });

    try {
      const response = await fetch(`/api/mentor/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check username");
      }

      setUsernameStatus({
        checking: false,
        available: data.available,
        message: data.message,
      });
    } catch (error) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: error.message || "Error checking username",
      });
    }
  }, 500);

  // Update handleInputChange to include username check
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check username availability when username field changes
    if (name === "username") {
      checkUsername(value);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      setUploadedImage(data.secure_url);
      setFormData(prev => ({
        ...prev,
        profilePhoto: data.secure_url
      }));
    } catch (error) {
      setErrorMessage('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.isOrganic && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/mentor/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create mentor");
      }

      // Show the new mentor credentials
      setNewMentor({
        name: data.mentor.name,
        username: data.mentor.username,
        password: data.password,
        isOrganic: data.mentor.isOrganic,
      });

      // Refresh the mentors list
      fetchMentors(1);

      setSuccessMessage("Mentor created successfully");

      // Reset form
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        profilePhoto: "",
        isOrganic: true,
        bio: "",
        skills: [],
        socialLinks: {},
        subject: "",
        language: "",
      });
      setUploadedImage(null);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Link
                key={mentor.id}
                href={`/admin/mentors/${mentor.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:ring-2 hover:ring-blue-400 transition"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={mentor.profilePhoto}
                    alt={mentor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{mentor.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      mentor.isOrganic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {mentor.isOrganic ? 'Organic' : 'Inorganic'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">@{mentor.username}</p>
                  {mentor.bio && (
                    <p className="text-sm text-gray-600 mb-2">{mentor.bio}</p>
                  )}
                  {mentor.skills && mentor.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {mentor.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex space-x-2">
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsAddingMentor(true);
                        setFormData({
                          ...mentor,
                          password: '',
                          confirmPassword: '',
                        });
                        setIsOrganic(mentor.isOrganic);
                        setUploadedImage(mentor.profilePhoto);
                      }}
                    >
                      Edit
                    </button>
                    {mentor.isOrganic && (
                      <button className="text-blue-600 hover:underline text-sm" onClick={e => e.preventDefault()}>Reset Password</button>
                    )}
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm('Are you sure you want to delete this mentor?')) {
                          setIsLoading(true);
                          setErrorMessage("");
                          try {
                            const res = await fetch(`/api/mentor/${mentor.id}`, { method: 'DELETE' });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message || 'Failed to delete mentor');
                            fetchMentors(1);
                            setSuccessMessage('Mentor deleted successfully');
                          } catch (err) {
                            setErrorMessage(err.message || 'Failed to delete mentor');
                          } finally {
                            setIsLoading(false);
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <button
                onClick={() => fetchMentors(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchMentors(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
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
              <h2 className="text-2xl font-bold text-gray-900">Add New Mentor</h2>
              <button
                onClick={() => {
                  setIsAddingMentor(false);
                  setNewMentor(null);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
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
                <h3 className="mb-4 text-lg font-semibold">New Mentor Credentials</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {newMentor.name}</p>
                  <p><span className="font-medium">Username:</span> {newMentor.username}</p>
                  {newMentor.isOrganic && (
                    <p><span className="font-medium">Password:</span> {newMentor.password}</p>
                  )}
                </div>
                <p className="mt-4 text-xs text-gray-600">Please save these credentials securely. The password cannot be recovered later.</p>
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
                    <label className="mb-1 block text-sm font-medium text-gray-700">Mentor Type</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={isOrganic}
                          onChange={() => {
                            setIsOrganic(true);
                            setFormData(prev => ({ ...prev, isOrganic: true }));
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
                            setIsOrganic(false);
                            setFormData(prev => ({ ...prev, isOrganic: false }));
                          }}
                          className="form-radio h-4 w-4 text-black"
                        />
                        <span className="ml-2">Inorganic</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Profile Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2 w-full"
                      required
                    />
                    {uploadedImage && (
                      <div className="mt-2 relative h-32 w-32">
                        <Image
                          src={uploadedImage}
                          alt="Uploaded"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
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
                    <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`mt-2 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                        usernameStatus.available === null
                          ? "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          : usernameStatus.available
                          ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                          : "border-red-500 focus:border-red-500 focus:ring-red-500"
                      }`}
                      placeholder="Enter username"
                      required
                    />
                    {formData.username && (
                      <p
                        className={`mt-1 text-sm ${
                          usernameStatus.checking
                            ? "text-gray-500"
                            : usernameStatus.available
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {usernameStatus.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
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
                    <label className="mb-1 block text-sm font-medium text-gray-700">Language</label>
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email (Optional)</label>
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">Bio (Optional)</label>
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
                      <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsAddingMentor(false)}
                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                    disabled={isLoading || (formData.username && !usernameStatus.available)}
                  >
                    {isLoading ? "Creating..." : "Add Mentor"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}