"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

export default function SchoolsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
  });

  // New school created info
  const [newSchool, setNewSchool] = useState(null);

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);

        // Check for cached data
        const cachedData = sessionStorage.getItem('allSchools');
        const cachedTimestamp = sessionStorage.getItem('allSchools:timestamp');
        const isCacheValid = cachedTimestamp && (Date.now() - parseInt(cachedTimestamp)) < 300000; // 5 min cache

        if (cachedData && isCacheValid) {
          setSchools(JSON.parse(cachedData));
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/schools');
        const data = await response.json();

        if (data.success) {
          setSchools(data.schools);
          // Cache the data
          sessionStorage.setItem('allSchools', JSON.stringify(data.schools));
          sessionStorage.setItem('allSchools:timestamp', Date.now().toString());
        } else {
          setErrorMessage(data.error || "Failed to fetch schools");
        }
      } catch (error) {
        setErrorMessage("Error fetching schools: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create school");
      }

      // Show the new school info
      setNewSchool({
        id: data.school.id,
        name: data.school.name,
        code: data.school.code,
      });

      // Add the new school to the list
      setSchools([
        data.school,
        ...schools,
      ]);

      setSuccessMessage("School created successfully");

      // Reset form
      setFormData({
        name: "",
        code: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the filtered schools to prevent unnecessary re-renders
  const filteredSchools = useMemo(() => {
    return schools.filter(
      (school) =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.email && school.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (school.phone && school.phone.includes(searchTerm))
    );
  }, [schools, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Schools</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
        >
          <span className="mr-2">+</span> Add School
        </button>
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search schools..."
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
                  <tr key={school.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{school.name}</td>
                    <td className="px-4 py-3">{school.code}</td>
                    <td className="px-4 py-3">{school.email || "-"}</td>
                    <td className="px-4 py-3">{school.phone || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/schools/${school.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View Classes
                        </Link>
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    No schools found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredSchools.length}</span> of{" "}
            <span className="font-medium">{schools.length}</span> schools
          </p>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New School</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewSchool(null);
                  setErrorMessage("");
                  setSuccessMessage("");
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

            {newSchool ? (
              <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm">
                <h3 className="mb-2 font-semibold">School Created Successfully</h3>
                <p><span className="font-medium">Name:</span> {newSchool.name}</p>
                <p><span className="font-medium">Code:</span> {newSchool.code}</p>
                <div className="mt-4 flex justify-center">
                  <Link
                    href={`/admin/schools/${newSchool.id}`}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Add Classes to This School
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">School Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter school name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">School Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., SCH001"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter school email"
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-1 block text-sm font-medium">Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter school phone number"
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
                    {isLoading ? "Creating..." : "Add School"}
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