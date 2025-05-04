"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SchoolDetailPage() {
  const params = useParams();
  const schoolId = params.schoolId;

  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [school, setSchool] = useState(null);
  const [classes, setClasses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Class form state
  const [classFormData, setClassFormData] = useState({
    name: "",
    totalStudents: "",
    boys: "",
    girls: "",
    startRollNumber: "1",
  });

  // New class created info
  const [newClass, setNewClass] = useState(null);

  // Fetch school and its classes on component mount
  useEffect(() => {
    const fetchSchoolAndClasses = async () => {
      try {
        // Fetch school details
        const schoolResponse = await fetch(`/api/schools/${schoolId}`);
        const schoolData = await schoolResponse.json();
        
        if (schoolData.success) {
          setSchool(schoolData.school);
        } else {
          setErrorMessage(schoolData.error || "Failed to fetch school details");
          return;
        }

        // Fetch classes for this school
        const classesResponse = await fetch(`/api/schools/${schoolId}/classes`);
        const classesData = await classesResponse.json();
        
        if (classesData.success) {
          setClasses(classesData.classes);
        } else {
          setErrorMessage(classesData.error || "Failed to fetch classes");
        }
      } catch (error) {
        setErrorMessage("Error fetching data: " + error.message);
      }
    };

    fetchSchoolAndClasses();
  }, [schoolId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassFormData({
      ...classFormData,
      [name]: value,
    });
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/classes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...classFormData,
          schoolId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create class");
      }

      // Show the new class info
      setNewClass(data.class);

      // Add the new class to the list
      setClasses([
        data.class,
        ...classes,
      ]);

      setSuccessMessage("Class created successfully");

      // Reset form
      setClassFormData({
        name: "",
        totalStudents: "",
        boys: "",
        girls: "",
        startRollNumber: "1",
      });
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClasses = classes.filter(
    (cls) => cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!school) {
    return <div className="p-6 text-center">Loading school information...</div>;
  }

  return (
    <div className="space-y-6">
      {/* School Header */}
      <div className="bg-white rounded-lg border p-6 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{school.name}</h1>
            <div className="mt-1 text-sm text-gray-600">Code: {school.code}</div>
            {school.email && <div className="mt-1 text-sm text-gray-600">Email: {school.email}</div>}
            {school.phone && <div className="mt-1 text-sm text-gray-600">Phone: {school.phone}</div>}
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="rounded-md border px-4 py-2 text-sm font-medium mr-2">
              Edit School
            </button>
            <Link
              href="/admin/schools"
              className="rounded-md border px-4 py-2 text-sm font-medium"
            >
              Back to Schools
            </Link>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Classes</h2>
        <button
          onClick={() => setIsAddClassModalOpen(true)}
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
                <th className="px-4 py-3">Class Name</th>
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
                    <td className="px-4 py-3 font-medium">{cls.name}</td>
                    <td className="px-4 py-3">{cls.totalStudents || 0}</td>
                    <td className="px-4 py-3">{cls.boys || 0}</td>
                    <td className="px-4 py-3">{cls.girls || 0}</td>
                    <td className="px-4 py-3">{cls.startRollNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/schools/${schoolId}/classes/${cls.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View Students
                        </Link>
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                    No classes found for this school.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredClasses.length}</span> of{" "}
            <span className="font-medium">{classes.length}</span> classes
          </p>
        </div>
      </div>

      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Class to {school.name}</h2>
              <button
                onClick={() => {
                  setIsAddClassModalOpen(false);
                  setNewClass(null);
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

            {newClass ? (
              <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm">
                <h3 className="mb-2 font-semibold">Class Created Successfully</h3>
                <p><span className="font-medium">Name:</span> {newClass.name}</p>
                <div className="mt-4 flex justify-center">
                  <Link
                    href={`/admin/schools/${schoolId}/classes/${newClass.id}`}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Add Students to This Class
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddClass}>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">Class Name</label>
                  <input
                    type="text"
                    name="name"
                    value={classFormData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 10th Grade - A"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Total Students</label>
                    <input
                      type="number"
                      name="totalStudents"
                      value={classFormData.totalStudents}
                      onChange={handleInputChange}
                      className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Total count"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Start Roll Number</label>
                    <input
                      type="number"
                      name="startRollNumber"
                      value={classFormData.startRollNumber}
                      onChange={handleInputChange}
                      className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 101"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Boys</label>
                    <input
                      type="number"
                      name="boys"
                      value={classFormData.boys}
                      onChange={handleInputChange}
                      className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Number of boys"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Girls</label>
                    <input
                      type="number"
                      name="girls"
                      value={classFormData.girls}
                      onChange={handleInputChange}
                      className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Number of girls"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddClassModalOpen(false)}
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
                    {isLoading ? "Creating..." : "Add Class"}
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