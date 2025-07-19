"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClassesPage() {
  const params = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    totalStudents: 0,
    boys: 0,
    girls: 0,
  });

  useEffect(() => {
    fetchClasses();
  }, [params.schoolId]);

  const fetchClasses = async () => {
    try {
      const response = await fetch(`/api/schools/${params.schoolId}/classes`);
      const data = await response.json();
      if (data.success) {
        setClasses(data.classes);
      } else {
        setErrorMessage(data.error || "Failed to fetch classes");
      }
    } catch (error) {
      setErrorMessage("Something went wrong");
    }
  };

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
      const response = await fetch(`/api/schools/${params.schoolId}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create class");
      }

      setSuccessMessage("Class created successfully");
      setFormData({
        name: "",
        totalStudents: 0,
        boys: 0,
        girls: 0,
      });
      fetchClasses();
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    try {
      const currentRollNo = classes.length > 0 ? classes[classes.length - 1].totalStudents : 0;
      const newStudents = bulkStudents.map((student, index) => ({
        ...student,
        rollNo: currentRollNo + index + 1,
      }));

      // TO DO: implement API call to create students in bulk

      setBulkStudents([]);
      setShowBulkImport(false);
    } catch (error) {
      console.error("Error in bulk import:", error);
    }
  };

  const filteredClasses = classes.filter(
    (cls) => cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Total Students</th>
                <th className="px-4 py-3">Boys</th>
                <th className="px-4 py-3">Girls</th>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/schools/${params.schoolId}/classes/${cls.id}/students`}
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
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    No classes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredClasses.length}</span> of <span className="font-medium">{classes.length}</span> classes
          </p>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Class</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-600">
              To add a new class to this school, please use the main school detail page where you can select from existing common classes and assign sections. Direct creation of classes here is disabled to prevent duplicate or incorrect entries.
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
