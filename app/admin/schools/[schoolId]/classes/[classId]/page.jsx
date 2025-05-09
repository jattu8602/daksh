"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ClassDetailPage() {
  const params = useParams();
  const schoolId = params.schoolId;
  const classId = params.classId;

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
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

  // Bulk import state
  const [bulkImportData, setBulkImportData] = useState({
    students: Array(10).fill({
      name: "",
      rollNo: "",
      gender: ""
    }),
    availableBoys: classData?.totalStudents || 0,
    availableGirls: 0,
    startRollNumber: classData?.startRollNumber || 1
  });

  // New student created info
  const [newStudent, setNewStudent] = useState(null);

  // QR Code modal state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch school, class and students on component mount with improved caching
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        console.log("Fetching class details for:", schoolId, classId);

        // Use cache-first strategy with performance improvements
        const cacheKey = `class:${schoolId}:${classId}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(`${cacheKey}:timestamp`);

        // Check if cache is recent (less than 1 minute old) and not returning from bulk import
        const cacheAge = cachedTimestamp ? Date.now() - parseInt(cachedTimestamp) : Infinity;
        const hasBulkImportQuery = typeof window !== 'undefined' &&
          (window.location.search.includes('fromBulkImport') ||
           window.location.search.includes('refresh'));

        // Set loading state only if we need to fetch
        if (!(cachedData && cacheAge < 60000 && !hasBulkImportQuery)) {
          setIsLoading(true);

          // Clear any existing cached data if we're forcing a refresh
          if (hasBulkImportQuery) {
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(`${cacheKey}:timestamp`);
            console.log("Clearing cache due to refresh parameter");
          }
        }

        if (cachedData && cacheAge < 60000 && !hasBulkImportQuery) {
          const data = JSON.parse(cachedData);
          console.log("Using cached data:", data.class.name, "Students:", data.class.students?.length || 0);
          setClassData(data.class);
          setSchool(data.class.school);
          setStudents(data.class.students || []);

          // Remove any query parameters to clean the URL
          if (hasBulkImportQuery && typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          return;
        }

        console.log("Making API request for fresh data");
        const response = await fetch(`/api/schools/${schoolId}/classes/${classId}?no-cache=true`);
        const data = await response.json();

        if (data.success) {
          console.log("API returned data successfully:",
            "Class:", data.class.name,
            "Students:", data.class.students?.length || 0);

          // Cache the data for 1 minute
          localStorage.setItem(cacheKey, JSON.stringify(data));
          localStorage.setItem(`${cacheKey}:timestamp`, Date.now().toString());

          setClassData(data.class);
          setSchool(data.class.school);

          // Make sure students is always an array
          const studentArray = Array.isArray(data.class.students) ? data.class.students : [];
          setStudents(studentArray);
          console.log("Student data set:", studentArray.length, "students");

          // Pre-fill the roll number with the next available one
          if (studentArray.length > 0) {
            const maxRollNo = Math.max(...studentArray.map(s => s.rollNo));
            setStudentFormData(prev => ({
              ...prev,
              rollNo: (maxRollNo + 1).toString(),
            }));
          } else {
            setStudentFormData(prev => ({
              ...prev,
              rollNo: data.class.startRollNumber.toString(),
            }));
          }

          // Remove any query parameters to clean the URL
          if (hasBulkImportQuery && typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          console.error("Failed to fetch class details:", data.error);
          setErrorMessage(data.error || "Failed to fetch class details");
        }
      } catch (error) {
        console.error("Error in fetchClassDetails:", error);
        setErrorMessage("Error fetching data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();

    // Add a load listener to ensure we refresh data when navigating back from the bulk import page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchClassDetails();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [schoolId, classId]);

  // Add debugging for students state changes
  useEffect(() => {
    console.log("Students state updated:", students?.length || 0, "students");
  }, [students]);

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
      const response = await fetch(`/api/schools/${schoolId}/classes/${classId}/students`, {
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

      // Calculate roll numbers if not provided
      const studentsWithRolls = bulkImportData.students.map((student, index) => {
        if (!student.rollNo) {
          return {
            ...student,
            rollNo: bulkImportData.startRollNumber + index
          };
        }
        return student;
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

      // Update the students list with the latest data from the API response
      if (data.students && Array.isArray(data.students)) {
        setStudents(data.students);
      } else {
        // If no students data in response, force a fresh fetch from the API
        const refreshResponse = await fetch(`/api/schools/${schoolId}/classes/${classId}`);
        const refreshData = await refreshResponse.json();

        if (refreshData.success) {
          // Update cache with fresh data
          const cacheKey = `class:${schoolId}:${classId}`;
          localStorage.setItem(cacheKey, JSON.stringify(refreshData));
          localStorage.setItem(`${cacheKey}:timestamp`, Date.now().toString());

          // Update state with fresh data
          setClassData(refreshData.class);
          setSchool(refreshData.class.school);
          setStudents(refreshData.class.students);
        }
      }

      setSuccessMessage("Students imported successfully");

      // Reset the bulk import form
      setBulkImportData({
        students: Array(10).fill({
          name: "",
          rollNo: "",
          gender: ""
        }),
        availableBoys: classData?.totalStudents || 0,
        availableGirls: 0,
        startRollNumber: classData?.startRollNumber || 1
      });

      setIsBulkImportModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);

      // Directly trigger file download by creating a link to the export endpoint
      const exportUrl = `/api/schools/${schoolId}/classes/${classId}/export`;

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = exportUrl;
      link.setAttribute('download', `class_students_${classId}.xlsx`);
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

  const handleViewQR = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      setSelectedStudent(student);

      // Check if we already have the QR code data
      if (student.qrCodeData) {
        setSelectedQRCode(student.qrCodeData);
        setIsQRModalOpen(true);
        return;
      }

      // Fetch QR code if not available
      setIsLoading(true);
      const response = await fetch(`/api/students/${studentId}/qrcode`);
      const data = await response.json();

      if (data.success && data.qrCode) {
        // Handle different QR code formats - could be a data URL or a string that needs parsing
        let qrCodeImage = data.qrCode;

        // If it's a JSON string and not already a data URL, try to parse it
        if (typeof data.qrCode === 'string' && !data.qrCode.startsWith('data:image')) {
          try {
            // If it's already a base64 image
            if (data.qrCode.startsWith('data:')) {
              qrCodeImage = data.qrCode;
            } else {
              // If it's a JSON string with QR data, we'll need a different approach
              // For now, we'll just display the data
              const qrData = JSON.parse(data.qrCode);

              // Update student with password from QR if available
              if (qrData.password && !student.password) {
                student.password = qrData.password;
              }

              // This would normally require generating a QR code client-side
              // but for simplicity, we'll create a placeholder
              qrCodeImage = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="white"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="monospace">QR Code</text></svg>`;
            }
          } catch (e) {
            console.error("Error parsing QR code data:", e);
            // Fallback to using the string as-is
            qrCodeImage = data.qrCode;
          }
        }

        // Update the student with the QR code data and any additional info
        const updatedStudents = students.map(s => {
          if (s.id === studentId) {
            return {
              ...s,
              qrCodeData: qrCodeImage,
              password: data.studentInfo?.password || s.password
            };
          }
          return s;
        });

        setStudents(updatedStudents);
        setSelectedStudent({
          ...student,
          password: data.studentInfo?.password || student.password,
          qrCodeData: qrCodeImage
        });
        setSelectedQRCode(qrCodeImage);
        setIsQRModalOpen(true);
      } else {
        setErrorMessage("Failed to retrieve QR code");
      }
    } catch (error) {
      setErrorMessage("Error fetching QR code: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize filtered students to prevent unnecessary re-renders
  const filteredStudents = useMemo(() => {
    // Ensure students is an array before filtering
    if (!Array.isArray(students)) {
      console.warn("Students is not an array:", students);
      return [];
    }

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toString().includes(searchTerm) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Add refresh function
  const handleRefresh = () => {
    // Add refresh parameter to force a reload
    window.location.href = `${window.location.pathname}?refresh=true`;
  };

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
            <button
              onClick={handleRefresh}
              className="rounded-md border px-4 py-2 text-sm font-medium mr-2"
            >
              Refresh Data
            </button>
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

      {/* Error Messages Section */}
      {errorMessage && (
        <div className="p-4 mb-4 border border-red-200 rounded-md bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{errorMessage}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Messages Section */}
      {successMessage && (
        <div className="p-4 mb-4 border border-green-200 rounded-md bg-green-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <Link
            href={`/admin/schools/${schoolId}/classes/${classId}/bulk`}
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
          >
            <span className="mr-2">+</span> Bulk Import Students
          </Link>
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
                <th className="px-4 py-3">Password</th>
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
                      {student.password ? (
                        student.password
                      ) : (
                        <span className="text-gray-400">•••••••••</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {student.qrCode ? (
                        <button
                          onClick={() => handleViewQR(student.id)}
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <span className="mr-1">View QR</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                          </svg>
                        </button>
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
                  <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
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
                      setStudentFormData({
                        name: "",
                        rollNo: (parseInt(studentFormData.rollNo) + 1).toString(),
                      });
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

      {/* Bulk Import Modal */}
      {isBulkImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Bulk Import Students</h2>
              <button
                onClick={() => {
                  setIsBulkImportModalOpen(false);
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

            <div className="space-y-6">
              {/* Class Structure */}
              <div className="bg-gray-50 p-4 rounded-lg">
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
                              newStudents[index].name = e.target.value;
                              setBulkImportData({ students: newStudents });
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
                              newStudents[index].gender = e.target.value;
                              setBulkImportData({ students: newStudents });
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
                              newStudents[index].rollNo = e.target.value;
                              setBulkImportData({ students: newStudents });
                            }}
                            className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Roll Number"
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsBulkImportModalOpen(false)}
                  className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
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
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Export Student Data</h2>
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
              <p>This will export all student data including:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Roll Numbers</li>
                <li>Names</li>
                <li>Usernames</li>
                <li>Passwords</li>
                <li>QR Code status</li>
              </ul>
              <p className="mt-2 text-red-500 font-medium">Note: This includes sensitive information. Please ensure you're authorized to access this data.</p>
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

      {/* QR Code Modal */}
      {isQRModalOpen && selectedQRCode && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">QR Code: {selectedStudent.name}</h2>
              <button
                onClick={() => {
                  setIsQRModalOpen(false);
                  setSelectedQRCode(null);
                  setSelectedStudent(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 rounded-lg bg-white p-2 shadow">
                <img
                  src={selectedQRCode}
                  alt={`QR Code for ${selectedStudent.name}`}
                  className="w-64 h-64"
                />
              </div>

              <div className="mt-2 mb-4 text-sm">
                <p><span className="font-semibold">Student:</span> {selectedStudent.name}</p>
                <p><span className="font-semibold">Roll No:</span> {selectedStudent.rollNo}</p>
                <p><span className="font-semibold">Username:</span> {selectedStudent.username}</p>
                {selectedStudent.password && (
                  <p><span className="font-semibold">Password:</span> {selectedStudent.password}</p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    // Download QR code
                    const link = document.createElement('a');
                    link.href = selectedQRCode;
                    link.download = `qrcode-${selectedStudent.name}-${selectedStudent.rollNo}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Download QR
                </button>
                <button
                  onClick={() => {
                    setIsQRModalOpen(false);
                    setSelectedQRCode(null);
                    setSelectedStudent(null);
                  }}
                  className="rounded-md border px-3 py-2 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}