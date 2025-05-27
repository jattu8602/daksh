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

  // Get current user from sessionStorage
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch {}
    }
  }, []);

  // Fetch admins on component mount
  useEffect(() => {
    async function fetchAdmins() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/list");
        const data = await response.json();
        if (response.ok) {
          setAdmins(data.admins);
        } else {
          setErrorMessage(data.error || "Failed to fetch admins");
        }
      } catch (error) {
        setErrorMessage(error.message || "Failed to fetch admins");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdmins();
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

  // Delete admin handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete admin");
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      setSuccessMessage("Admin deleted successfully");
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete admin");
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

  // Edit admin modal state
  const [editAdmin, setEditAdmin] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', username: '' });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const openEditModal = (admin) => {
    setEditAdmin(admin);
    setEditForm({ name: admin.name, email: admin.email, username: admin.username });
    setEditError("");
  };
  const closeEditModal = () => {
    setEditAdmin(null);
    setEditForm({ name: '', email: '', username: '' });
    setEditError("");
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const response = await fetch("/api/admin/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editAdmin.id,
          name: editForm.name,
          email: editForm.email,
          username: editForm.username,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update admin");
      setAdmins((prev) => prev.map((a) => a.id === editAdmin.id ? {
        ...a,
        name: editForm.name,
        email: editForm.email,
        username: editForm.username,
      } : a));
      setSuccessMessage("Admin updated successfully");
      closeEditModal();
    } catch (error) {
      setEditError(error.message || "Failed to update admin");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admins</h1>
    {currentUser?.role === "SUPER_ADMIN" && (
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none"
      >
        <span className="mr-2">+</span> Add Admin
      </button>
    )}
  </div>

  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Username</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700 dark:text-gray-200">
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3 font-medium">{admin.name}</td>
                <td className="px-4 py-3">{admin.email}</td>
                <td className="px-4 py-3">{admin.username}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {currentUser?.role === "SUPER_ADMIN" ? (
                      <>
                        <button className="text-blue-600 dark:text-blue-400 hover:underline" onClick={() => openEditModal(admin)}>Edit</button>
                        <button className="text-red-600 dark:text-red-400 hover:underline" onClick={() => handleDelete(admin.id)}>Delete</button>
                      </>
                    ) : (
                      <span className="text-gray-400">View Only</span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                No admins found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="flex items-center justify-between p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium">{filteredAdmins.length}</span> of{" "}
        <span className="font-medium">{admins.length}</span> admins
      </p>
    </div>
  </div>

  {/* Add Admin Modal */}
  {isAddModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-900 p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Admin</h2>
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
          <div className="mb-4 rounded bg-red-50 dark:bg-red-950 p-3 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded bg-green-50 dark:bg-green-950 p-3 text-sm text-green-600 dark:text-green-400">
            {successMessage}
          </div>
        )}

        {newAdmin ? (
          <div className="mb-6 rounded-lg bg-blue-50 dark:bg-blue-950 p-4 text-sm text-gray-800 dark:text-gray-200">
            <h3 className="mb-2 font-semibold">New Admin Credentials</h3>
            <p><span className="font-medium">Name:</span> {newAdmin.name}</p>
            <p><span className="font-medium">Username:</span> {newAdmin.username}</p>
            <p><span className="font-medium">Password:</span> {newAdmin.password}</p>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">Please save these credentials securely. The password cannot be recovered later.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {["name", "email", "phone"].map((field, i) => (
              <div key={field} className={`mb-4 ${i === 2 ? "mb-6" : ""}`}>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field === "name" && "Full Name"}
                  {field === "email" && "Email"}
                  {field === "phone" && "Phone (Optional)"}
                </label>
                <input
                  type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Enter ${field}`}
                  required={field !== "phone"}
                />
              </div>
            ))}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-700"
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

  {/* Edit Admin Modal */}
  {editAdmin && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-900 p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Admin</h2>
          <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        {editError && (
          <div className="mb-4 rounded bg-red-50 dark:bg-red-950 p-3 text-sm text-red-600 dark:text-red-400">
            {editError}
          </div>
        )}
        <form onSubmit={handleEditSubmit}>
          {["name", "email", "username"].map((field, i) => (
            <div key={field} className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field === "name" && "Full Name"}
                {field === "email" && "Email"}
                {field === "username" && "Username"}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={editForm[field]}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          ))}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              disabled={editLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-700"
              disabled={editLoading}
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

  );
}