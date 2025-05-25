"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SchoolDetailPage() {
  const params = useParams();
  const schoolId = params.schoolId;

  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [isDeleteClassModalOpen, setIsDeleteClassModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);
  const [classToDelete, setClassToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [school, setSchool] = useState(null);
  const [classes, setClasses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Add state for all classes
  const [allClasses, setAllClasses] = useState([]);

  // Update class form state
  const [classFormData, setClassFormData] = useState({
    classId: "",
    startRollNumber: "1",
    section: "",
  });

  // New class created info
  const [newClass, setNewClass] = useState(null);

  // Add state for export modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Fetch all classes on component mount
  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await fetch('/api/classes');
        const data = await response.json();
        if (data.success) {
          setAllClasses(data.classes);
          console.log("All classes for dropdown:", data.classes);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchAllClasses();
  }, []);

  // Fetch school and its classes on component mount
  useEffect(() => {
    const fetchSchoolAndClasses = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        // Fetch both in parallel
        const [schoolResponse, classesResponse] = await Promise.all([
          fetch(`/api/schools/${schoolId}?no-cache=true`),
          fetch(`/api/schools/${schoolId}/classes?no-cache=true`)
        ]);

        // Parse both responses
        const schoolJson = await schoolResponse.json();
        const classesJson = await classesResponse.json();

        if (schoolJson.success) {
          setSchool(schoolJson.school);
        } else {
          setErrorMessage(schoolJson.error || "Failed to fetch school details");
        }

        if (classesJson.success) {
          const classesArray = classesJson.classes || [];
          setClasses(classesArray);
        } else {
          setErrorMessage(classesJson.error || "Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error fetching data: " + error.message);
      } finally {
        setIsLoading(false);
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
          classId: classFormData.classId,
          schoolId,
          startRollNumber: classFormData.startRollNumber,
          section: classFormData.section.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create class");
      }

      setNewClass(data.class);
      sessionStorage.removeItem(`school:${schoolId}:classes`);
      sessionStorage.removeItem(`school:${schoolId}:classes:timestamp`);
      const classesResponse = await fetch(`/api/schools/${schoolId}/classes?no-cache=true`);
      const classesData = await classesResponse.json();
      if (classesData.success) {
        setClasses(classesData.classes || []);
      }
      setSuccessMessage("Class created successfully");
      setClassFormData({
        classId: "",
        startRollNumber: "1",
        section: "",
      });
      setIsAddClassModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClassClick = (cls) => {
    setClassToEdit(cls);
    setClassFormData({
      classId: cls.id,
      startRollNumber: cls.startRollNumber || "1",
      section: cls.section || "",
    });
    setIsEditClassModalOpen(true);
  };

  const handleEditClassSubmit = async (e) => {
    e.preventDefault();
    if (!classToEdit) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/classes/${classToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update class");
      }

      // Update the class in the list
      setClasses(classes.map(cls =>
        cls.id === classToEdit.id ? data.class : cls
      ));

      // Clear cache
      sessionStorage.removeItem(`school:${schoolId}:classes`);
      sessionStorage.removeItem(`school:${schoolId}:classes:timestamp`);

      toast.success('Class updated successfully');
      setIsEditClassModalOpen(false);
      setClassToEdit(null);
      setClassFormData({
        classId: "",
        startRollNumber: "1",
        section: "",
      });
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClassClick = (cls) => {
    setClassToDelete(cls);
    setIsDeleteClassModalOpen(true);
  };

  const handleDeleteClassConfirm = async () => {
    if (!classToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/classes/${classToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete class');
      }

      // Remove the class from the list
      setClasses(classes.filter(cls => cls.id !== classToDelete.id));

      // Clear cache
      sessionStorage.removeItem(`school:${schoolId}:classes`);
      sessionStorage.removeItem(`school:${schoolId}:classes:timestamp`);

      toast.success('Class deleted successfully');
      setIsDeleteClassModalOpen(false);
      setClassToDelete(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete class');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Clear cache
      sessionStorage.removeItem(`school:${schoolId}:classes`);
      sessionStorage.removeItem(`school:${schoolId}:classes:timestamp`);

      // Fetch fresh data
      const classesResponse = await fetch(`/api/schools/${schoolId}/classes?no-cache=true`);
      const classesData = await classesResponse.json();

      if (classesData.success) {
        setClasses(classesData.classes || []);
        setSuccessMessage("Classes refreshed successfully");
      } else {
        throw new Error(classesData.error || "Failed to refresh classes");
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to refresh classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);

      // Directly trigger file download by creating a link to the export endpoint
      const exportUrl = `/api/schools/${schoolId}/export`;

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = exportUrl;
      link.setAttribute('download', `school_students_${schoolId}.xlsx`);
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);

      setSuccessMessage("Export started successfully");
    } catch (error) {
      setErrorMessage("Error exporting data: " + error.message);
    } finally {
      setIsLoading(false);
      setIsExportModalOpen(false);
    }
  };

  // Add filtered classes memo
  const filteredClasses = useMemo(() => {
    if (!classes || !Array.isArray(classes)) return [];
    return classes.filter(cls =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classes, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading school information...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Failed to load school information</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
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
            <button
              onClick={handleRefresh}
              className="rounded-md border px-4 py-2 text-sm font-medium mr-2"
            >
              Refresh Classes
            </button>
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
          {isLoading ? (
            <div className="p-4 text-center">Loading classes...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                  <th className="px-4 py-3">Class Name</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Total Students</th>
                  <th className="px-4 py-3">Boys</th>
                  <th className="px-4 py-3">Girls</th>
                  <th className="px-4 py-3">Start Roll No.</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredClasses && filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => (
                    <tr key={cls.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{cls.name}</td>
                      <td className="px-4 py-3">{cls.section || '-'}</td>
                      <td className="px-4 py-3">{cls.totalStudents || 0}</td>
                      <td className="px-4 py-3">{cls.boys || 0}</td>
                      <td className="px-4 py-3">{cls.girls || 0}</td>
                      <td className="px-4 py-3">{cls.startRollNumber || 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/schools/${schoolId}/classes/${cls.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            View Students
                          </Link>
                          <button
                            onClick={() => handleEditClassClick(cls)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClassClick(cls)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                      {classes && Array.isArray(classes) && classes.length === 0
                        ? "No classes found for this school."
                        : "Error loading classes. Please refresh the page."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredClasses.length}</span> of{" "}
            <span className="font-medium">{classes.length}</span> classes
          </p>
        </div>
      </div>

      {/* Edit Class Modal */}
      {isEditClassModalOpen && classToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Class</h2>
              <button
                onClick={() => {
                  setIsEditClassModalOpen(false);
                  setClassToEdit(null);
                  setErrorMessage("");
                  setSuccessMessage("");
                  setClassFormData({
                    classId: "",
                    startRollNumber: "1",
                    section: "",
                  });
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

            <form onSubmit={handleEditClassSubmit}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Select Class</label>
                <Select
                  name="classId"
                  value={classFormData.classId}
                  onValueChange={(value) => setClassFormData({ ...classFormData, classId: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  name="section"
                  placeholder="e.g., A, B, Red, etc."
                  value={classFormData.section}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="mb-6">
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
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditClassModalOpen(false);
                    setClassToEdit(null);
                    setErrorMessage("");
                    setSuccessMessage("");
                    setClassFormData({
                      classId: "",
                      startRollNumber: "1",
                      section: "",
                    });
                  }}
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
                  {isLoading ? "Updating..." : "Update Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Class Confirmation Modal */}
      {isDeleteClassModalOpen && classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Delete Class</h2>
              <button
                onClick={() => {
                  setIsDeleteClassModalOpen(false);
                  setClassToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete {classToDelete.name}?
              </p>
              {classToDelete.totalStudents > 0 && (
                <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                  <p className="font-medium">Warning: This class has {classToDelete.totalStudents} students.</p>
                  <p className="mt-1">Deleting this class will also delete all associated students and their data.</p>
                  <p className="mt-1">This action cannot be undone.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteClassModalOpen(false);
                  setClassToDelete(null);
                }}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClassConfirm}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Class"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
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
                {/* Class Selection */}
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">Select Class</label>
                  <Select
                    name="classId"
                    value={classFormData.classId}
                    onValueChange={(value) => setClassFormData({ ...classFormData, classId: value })}
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
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    name="section"
                    placeholder="e.g., A, B, Red, etc."
                    value={classFormData.section}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Start Roll Number Input */}
                <div className="space-y-2">
                  <Label htmlFor="startRollNumber">Start Roll Number</Label>
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

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddClassModalOpen(false);
                      setClassFormData({
                        classId: "",
                        startRollNumber: "1",
                        section: "",
                      });
                    }}
                    className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
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

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Export All Student Data</h2>
              <button
                onClick={() => {
                  setIsExportModalOpen(false);
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

            <div className="mb-6 text-sm text-gray-600">
              <p>This will export data for all students in all classes, including:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Class-wise student lists</li>
                <li>Combined list of all students</li>
                <li>Usernames, passwords, and QR Code information</li>
              </ul>
              <p className="mt-2 text-red-500 font-medium">Note: This file will contain sensitive information for all students. Please ensure you're authorized to access this data.</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                disabled={isLoading}
              >
                {isLoading ? "Exporting..." : "Export Excel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}