"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, File, Download, X, CheckCircle, AlertTriangle } from "lucide-react";

export default function SmartBulkUploadPage() {
  const params = useParams();
  const router = useRouter();
  const { schoolId, classId } = params;

  const [classData, setClassData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startRollNumber, setStartRollNumber] = useState(1);
  const [rows, setRows] = useState(200);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadReport, setUploadReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`/api/schools/${schoolId}/classes/${classId}`);
        const data = await response.json();
        if (data.success) {
          setClassData(data.class);
          // Suggest next roll number
          const nextRollNo = (data.class.totalStudents || 0) + (data.class.startRollNumber || 1);
          setStartRollNumber(nextRollNo);
        } else {
          setErrorMessage(data.error || "Failed to fetch class details");
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
        setErrorMessage("Error fetching class details: " + error.message);
      }
    };
    if (schoolId && classId) {
      fetchClassData();
    }
  }, [schoolId, classId]);

  const handleDownloadTemplate = () => {
    const url = `/api/schools/${schoolId}/classes/${classId}/students/smart-bulk/template?startRollNumber=${startRollNumber}&rows=${rows}`;
    window.open(url, "_blank");
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setSelectedFile(file);
        setErrorMessage("");
        setUploadReport(null);
    } else {
        setSelectedFile(null);
        setErrorMessage("Please select a valid .xlsx file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
        setErrorMessage("Please select a file to upload.");
        return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setUploadReport(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const response = await fetch(`/api/schools/${schoolId}/classes/${classId}/students/smart-bulk/upload`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Upload failed");
        }

        setUploadReport(result);

        if(result.successfulImports > 0) {
            // Force a refresh of the class page data on redirect
            setTimeout(() => {
                router.push(`/admin/schools/${schoolId}/classes/${classId}?refresh=true`);
            }, 1500)
        }
    } catch (error) {
        console.error("Upload error:", error);
        setErrorMessage(error.message);
    } finally {
        setIsLoading(false);
    }
  };

  if (!classData) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Breadcrumbs */}
       <div className="text-sm breadcrumbs">
        <ul className="flex items-center space-x-2 text-gray-600">
          <li><Link href="/admin/schools" className="hover:underline">Schools</Link></li>
          <li className="flex items-center"><span className="mx-2">/</span><Link href={`/admin/schools/${schoolId}`} className="hover:underline">{classData.school?.name}</Link></li>
          <li className="flex items-center"><span className="mx-2">/</span><Link href={`/admin/schools/${schoolId}/classes/${classId}`} className="hover:underline">{classData.name}</Link></li>
          <li className="flex items-center"><span className="mx-2">/</span><span className="text-gray-900 font-medium">Smart Bulk Import</span></li>
        </ul>
      </div>

      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Smart Bulk Import for {classData.name}</h1>
        <p className="text-gray-600 mt-1">Efficiently add multiple students using an Excel template.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Download Template */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="font-semibold text-lg flex items-center"><span className="bg-gray-200 text-gray-800 rounded-full h-8 w-8 text-sm flex items-center justify-center mr-3">1</span> Download Template</h2>
          <p className="text-gray-600 my-4">Get a pre-filled Excel template with the correct columns and starting roll numbers.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary w-full md:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </button>
        </div>

        {/* Step 2: Upload File */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="font-semibold text-lg flex items-center"><span className="bg-gray-200 text-gray-800 rounded-full h-8 w-8 text-sm flex items-center justify-center mr-3">2</span> Upload File</h2>
            <p className="text-gray-600 my-4">Once you've filled out the template, upload it here for processing.</p>
            <div className="mt-4">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                    Excel File (.xlsx)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <File className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            {selectedFile ? selectedFile.name : 'XLSX up to 10MB'}
                        </p>
                    </div>
                </div>
            </div>
            {selectedFile && (
                <button onClick={handleUpload} className="btn btn-primary w-full mt-4" disabled={isLoading}>
                    {isLoading ? <span className="loading loading-spinner"></span> : <Upload className="h-4 w-4 mr-2" />}
                    {isLoading ? 'Processing...' : 'Upload and Process'}
                </button>
            )}
        </div>
      </div>

      {/* Error Message */}
        {errorMessage && (
            <div className="alert alert-error shadow-lg">
                <div>
                    <X className="h-6 w-6"/>
                    <span>{errorMessage}</span>
                </div>
            </div>
        )}

      {/* Upload Report */}
      {uploadReport && (
        <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Import Report</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-2xl font-bold">{uploadReport.totalRows}</p>
                    <p className="text-sm text-gray-600">Total Rows</p>
                </div>
                <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{uploadReport.successfulImports}</p>
                    <p className="text-sm text-green-600">Successful Imports</p>
                </div>
                 <div className="p-4 bg-yellow-100 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-700">{uploadReport.skippedRows}</p>
                    <p className="text-sm text-yellow-600">Skipped Rows</p>
                </div>
                <div className="p-4 bg-red-100 rounded-lg">
                    <p className="text-2xl font-bold text-red-700">{uploadReport.errorList.length}</p>
                    <p className="text-sm text-red-600">Failed Rows</p>
                </div>
            </div>
            {uploadReport.errorList.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold">Error Details</h3>
                    <div className="overflow-x-auto mt-2 border rounded-lg">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Row</th>
                                    <th>Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uploadReport.errorList.map((err, index) => (
                                    <tr key={index}>
                                        <td>{err.row}</td>
                                        <td>{err.error}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Modal for template download options */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Download Template Options</h3>
            <div className="py-4 space-y-4">
                <div>
                    <label className="label">
                        <span className="label-text">Starting Roll Number</span>
                    </label>
                    <input type="number" value={startRollNumber} onChange={(e) => setStartRollNumber(parseInt(e.target.value))} className="input input-bordered w-full" />
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Number of Rows</span>
                    </label>
                    <input type="number" value={rows} onChange={(e) => setRows(parseInt(e.target.value))} className="input input-bordered w-full" />
                </div>
            </div>
            <div className="modal-action">
              <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleDownloadTemplate} className="btn btn-primary">
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}