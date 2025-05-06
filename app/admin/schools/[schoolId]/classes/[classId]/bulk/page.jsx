"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BulkImportPage() {
  const params = useParams();
  const schoolId = params.schoolId;
  const classId = params.classId;

  const [isLoading, setIsLoading] = useState(false);
  const [classData, setClassData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bulkImportData, setBulkImportData] = useState({
    students: [],
    availableBoys: 0,
    availableGirls: 0,
    startRollNumber: 1
  });

  // Fetch class details on mount - optimized version
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        // Check for cached class data first
        const cacheKey = `class:${schoolId}:${classId}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(`${cacheKey}:timestamp`);
        const isCacheValid = cachedTimestamp && (Date.now() - parseInt(cachedTimestamp) < 60000);

        if (isCacheValid && cachedData) {
          const data = JSON.parse(cachedData);
          const totalStudents = data.class.boys + data.class.girls;

          setClassData(data.class);
          setBulkImportData(prev => ({
            ...prev,
            students: Array(Math.min(20, totalStudents)).fill().map(() => ({
              name: "",
              rollNo: "",
              gender: ""
            })),
            availableBoys: data.class.boys || 0,
            availableGirls: data.class.girls || 0,
            startRollNumber: data.class.startRollNumber || 1
          }));
          return;
        }

        setIsLoading(true);
        const response = await fetch(`/api/schools/${schoolId}/classes/${classId}`);
        const data = await response.json();

        if (data.success) {
          const totalStudents = data.class.boys + data.class.girls;

          setClassData(data.class);
          setBulkImportData(prev => ({
            ...prev,
            // Limit initial array size for better performance
            students: Array(Math.min(20, totalStudents)).fill().map(() => ({
              name: "",
              rollNo: "",
              gender: ""
            })),
            availableBoys: data.class.boys || 0,
            availableGirls: data.class.girls || 0,
            startRollNumber: data.class.startRollNumber || 1
          }));
        } else {
          setErrorMessage(data.error || "Failed to fetch class details");
        }
      } catch (error) {
        setErrorMessage("Error fetching class details: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();
  }, [schoolId, classId]);

  const handleBulkImport = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Validate input
      const errors = [];
      bulkImportData.students.forEach((student, index) => {
        if (!student.name.trim()) {
          errors.push(`Student at row ${index + 1} has no name`);
        }
        if (!student.gender) {
          errors.push(`Student at row ${index + 1} has no gender`);
        }
        if (!student.rollNo) {
          errors.push(`Student at row ${index + 1} has no roll number`);
        }
      });

      if (errors.length > 0) {
        throw new Error(errors.join("\n"));
      }

      // Calculate roll numbers and generate usernames if not provided
      const studentsWithRolls = bulkImportData.students.map((student, index) => {
        const rollNo = student.rollNo || (bulkImportData.startRollNumber + index);
        const username = student.name
          ? `${student.name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")}${rollNo}`
          : '';

        return {
          ...student,
          rollNo,
          username
        };
      });

      const response = await fetch(`/api/schools/${schoolId}/classes/${classId}/students/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          students: studentsWithRolls,
          classId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to import students");
      }

      setSuccessMessage("Students imported successfully");

      // Clear any cached data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`class:${schoolId}:${classId}`);
        localStorage.removeItem(`class:${schoolId}:${classId}:timestamp`);
      }

      // Redirect back to class page with a query parameter to force refresh
      setTimeout(() => {
        window.location.href = `/admin/schools/${schoolId}/classes/${classId}?refresh=true&no-cache=true`;
      }, 1500);

    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamically add more rows as needed
  const addMoreRows = () => {
    setBulkImportData(prev => ({
      ...prev,
      students: [
        ...prev.students,
        ...Array(5).fill().map(() => ({
          name: "",
          rollNo: "",
          gender: ""
        }))
      ]
    }));
  };

  if (!classData) {
    return <div className="p-6 text-center">Loading class information...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumbs */}
      <div className="text-sm breadcrumbs">
        <ul className="flex items-center space-x-2 text-gray-600">
          <li><Link href="/admin/schools" className="hover:underline">Schools</Link></li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <Link href={`/admin/schools/${schoolId}`} className="hover:underline">{classData.school.name}</Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <Link href={`/admin/schools/${schoolId}/classes/${classId}`} className="hover:underline">{classData.name}</Link>
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
            <h1 className="text-2xl font-bold">Bulk Import Students for {classData.name}</h1>
            <div className="mt-1 text-sm text-gray-600">School: {classData.school.name} ({classData.school.code})</div>
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
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-600">
            {successMessage}
          </div>
        )}

        {/* Class Structure */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Class Structure</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Students:</span>
                <span className="font-medium text-gray-900">{bulkImportData.availableBoys + bulkImportData.availableGirls}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Boys:</span>
                <span className="font-medium text-blue-600">{bulkImportData.availableBoys}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Girls:</span>
                <span className="font-medium text-pink-600">{bulkImportData.availableGirls}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Start Roll No:</span>
                <span className="font-medium text-gray-900">{bulkImportData.startRollNumber}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Available Tags:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBulkImportData(prev => ({
                      ...prev,
                      availableBoys: Math.max(0, prev.availableBoys - 1)
                    }))}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                    disabled={bulkImportData.availableBoys <= 0}
                  >
                    Boy
                  </button>
                  <button
                    onClick={() => setBulkImportData(prev => ({
                      ...prev,
                      availableGirls: Math.max(0, prev.availableGirls - 1)
                    }))}
                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200"
                    disabled={bulkImportData.availableGirls <= 0}
                  >
                    Girl
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Roll Number</th>
                <th className="px-4 py-2">Username</th>
              </tr>
            </thead>
            <tbody>
              {bulkImportData.students.map((student, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => {
                        const newStudents = [...bulkImportData.students];
                        newStudents[index] = {
                          ...newStudents[index],
                          name: e.target.value
                        };
                        setBulkImportData(prev => ({
                          ...prev,
                          students: newStudents
                        }));
                      }}
                      className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter student name"
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={student.gender}
                      onChange={(e) => {
                        const newStudents = [...bulkImportData.students];
                        newStudents[index] = {
                          ...newStudents[index],
                          gender: e.target.value
                        };
                        setBulkImportData(prev => ({
                          ...prev,
                          students: newStudents
                        }));
                      }}
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
                      onChange={(e) => {
                        const newStudents = [...bulkImportData.students];
                        newStudents[index] = {
                          ...newStudents[index],
                          rollNo: e.target.value
                        };
                        setBulkImportData(prev => ({
                          ...prev,
                          students: newStudents
                        }));
                      }}
                      className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Roll Number"
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={student.username || ''}
                      readOnly
                      className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Username will be auto-generated"
                    />
                  </td>
                </tr>
              ))}

              {/* Display remaining slots */}
              {bulkImportData.students.length < (bulkImportData.availableBoys + bulkImportData.availableGirls) && (
                <tr className="border-b">
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                    <button
                      onClick={addMoreRows}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                    >
                      + Add 5 More Rows
                    </button>
                    <p className="mt-2">{bulkImportData.availableBoys + bulkImportData.availableGirls - bulkImportData.students.length} slots remaining</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-4">
          <Link
            href={`/admin/schools/${schoolId}/classes/${classId}`}
            className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleBulkImport}
            className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? "Importing..." : "Import Students"}
          </button>
        </div>
      </div>
    </div>
  );
}
