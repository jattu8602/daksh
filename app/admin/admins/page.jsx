"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // New admin created info (to show credentials)
  const [newAdmin, setNewAdmin] = useState(null);

  // Fetch admins on component mount
  useEffect(() => {
    // This would be replaced with an actual API call in production
    // Mock data for now
    const mockAdmins = [
      { id: 1, name: "James Admin", email: "james@example.com", username: "james_admin", role: "ADMIN" },
      { id: 2, name: "Sarah Manager", email: "sarah@example.com", username: "sarah_manager", role: "ADMIN" },
    ];
    setAdmins(mockAdmins);
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
      // Get current user from session (would be implemented with proper auth)
      const createdBy = "current-admin-id";

      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          createdBy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin");
      }

      // Show the new admin credentials
      setNewAdmin({
        name: data.admin.name,
        username: data.admin.username,
        password: data.password,
      });

      // Add the new admin to the list
      setAdmins([
        {
          id: data.admin.id,
          name: data.admin.name,
          email: data.admin.admin.email,
          username: data.admin.username,
          role: data.admin.role,
        },
        ...admins,
      ]);

      setSuccessMessage("Admin created successfully");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Admins</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
        >
          <span className="mr-2">+</span> Add Admin
        </button>
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search admins..."
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
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{admin.name}</td>
                    <td className="px-4 py-3">{admin.email}</td>
                    <td className="px-4 py-3">{admin.username}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredAdmins.length}</span> of{" "}
            <span className="font-medium">{admins.length}</span> admins
          </p>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Admin</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewAdmin(null);
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

            {newAdmin ? (
              <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm">
                <h3 className="mb-2 font-semibold">New Admin Credentials</h3>
                <p><span className="font-medium">Name:</span> {newAdmin.name}</p>
                <p><span className="font-medium">Username:</span> {newAdmin.username}</p>
                <p><span className="font-medium">Password:</span> {newAdmin.password}</p>
                <p className="mt-2 text-xs text-gray-600">Please save these credentials securely. The password cannot be recovered later.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter admin's full name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
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
                    placeholder="Enter phone number"
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
                    {isLoading ? "Creating..." : "Add Admin"}
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