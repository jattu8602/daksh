"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ClassDetailPage() {
  const params = useParams();
  const schoolId = params.schoolId;
  const classId = params.classId;

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [school, setSchool] = useState(null);
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Student form state
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    rollNo: "",
  });

  // New student created info
  const [newStudent, setNewStudent] = useState(null);

  // Fetch school, class and students on component mount
  useEffect(() => {
    // This would be replaced with actual API calls in production
    // Mock data for now
    const mockSchool = {
      id: schoolId,
      name: "Springfield High School",
      code: "SPR001",
    };

    const mockClass = {
      id: classId,
      name: "10th Grade - A",
      totalStudents: 32,
      boys: 18,
      girls: 14,
      startRollNumber: 101,
      schoolId,
    };

    const mockStudents = [
      { id: 1, name: "John Smith", rollNo: 101, username: "john_10a_spr001", qrCode: true },
      { id: 2, name: "Sarah Johnson", rollNo: 102, username: "sarah_10a_spr001", qrCode: true },
      { id: 3, name: "Michael Brown", rollNo: 103, username: "michael_10a_spr001", qrCode: true },
    ];

    setSchool(mockSchool);
    setClassData(mockClass);
    setStudents(mockStudents);

    // Pre-fill the roll number with the next available one
    if (mockClass && mockStudents.length > 0) {
      const maxRollNo = Math.max(...mockStudents.map(s => s.rollNo));
      setStudentFormData(prev => ({
        ...prev,
        rollNo: (maxRollNo + 1).toString(),
      }));
    } else if (mockClass) {
      setStudentFormData(prev => ({
        ...prev,
        rollNo: mockClass.startRollNumber.toString(),
      }));
    }
  }, [schoolId, classId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData({
      ...studentFormData,
      [name]: value,
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/students/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...studentFormData,
          classId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create student");
      }

      // Show the new student credentials
      setNewStudent({
        name: data.student.name,
        rollNo: data.student.student.rollNo,
        username: data.student.username,
        password: data.password,
      });

      // Add the new student to the list
      setStudents([
        {
          id: data.student.id,
          name: data.student.name,
          rollNo: data.student.student.rollNo,
          username: data.student.username,
          qrCode: true,
        },
        ...students,
      ]);

      setSuccessMessage("Student created successfully");

      // Reset form and prepare for next student by incrementing roll number
      setStudentFormData({
        name: "",
        rollNo: (parseInt(studentFormData.rollNo) + 1).toString(),
      });
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toString().includes(searchTerm) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!school || !classData) {
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
            <Link href={`/admin/schools/${schoolId}`} className="hover:underline">{school.name}</Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{classData.name}</span>
          </li>
        </ul>
      </div>

      {/* Class Header */}
      <div className="bg-white rounded-lg border p-6 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{classData.name}</h1>
            <div className="mt-1 text-sm text-gray-600">School: {school.name} ({school.code})</div>
            <div className="mt-3 flex flex-wrap gap-4">
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
          <div className="mt-4 sm:mt-0">
            <button className="rounded-md border px-4 py-2 text-sm font-medium mr-2">
              Edit Class
            </button>
            <Link
              href={`/admin/schools/${schoolId}`}
              className="rounded-md border px-4 py-2 text-sm font-medium"
            >
              Back to Classes
            </Link>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Students</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Export Data
          </button>
          <button
            onClick={() => setIsAddStudentModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
          >
            <span className="mr-2">+</span> Add Student
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search students..."
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
                <th className="px-4 py-3">Roll No.</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">QR Code</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3">{student.rollNo}</td>
                    <td className="px-4 py-3">{student.username}</td>
                    <td className="px-4 py-3">
                      {student.qrCode ? (
                        <button className="text-blue-600 hover:underline">View QR</button>
                      ) : (
                        <span className="text-gray-400">Not Generated</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button className="text-blue-600 hover:underline">Reset Password</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    No students found in this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredStudents.length}</span> of{" "}
            <span className="font-medium">{students.length}</span> students
          </p>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Student to {classData.name}</h2>
              <button
                onClick={() => {
                  setIsAddStudentModalOpen(false);
                  setNewStudent(null);
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

            {newStudent ? (
              <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm">
                <h3 className="mb-2 font-semibold">New Student Credentials</h3>
                <p><span className="font-medium">Name:</span> {newStudent.name}</p>
                <p><span className="font-medium">Roll No:</span> {newStudent.rollNo}</p>
                <p><span className="font-medium">Username:</span> {newStudent.username}</p>
                <p><span className="font-medium">Password:</span> {newStudent.password}</p>
                <p className="mt-2 text-xs text-gray-600">Please save these credentials securely. The password cannot be recovered later.</p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setNewStudent(null);
                    }}
                    className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Add Another Student
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddStudent}>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={studentFormData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-1 block text-sm font-medium">Roll Number</label>
                  <input
                    type="number"
                    name="rollNo"
                    value={studentFormData.rollNo}
                    onChange={handleInputChange}
                    className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter roll number"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Roll number should be unique within this class
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentModalOpen(false)}
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
                    {isLoading ? "Creating..." : "Add Student"}
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
              <h2 className="text-xl font-bold">Export Student Data</h2>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Export Type</label>
                <select className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="pdf">PDF (.pdf)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Data to Export</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Student Names</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Roll Numbers</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Usernames</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Passwords</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">QR Codes</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}