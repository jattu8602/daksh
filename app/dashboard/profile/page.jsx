"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      try {
        const response = await fetch("/api/auth/session", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success && data.user) {
          console.log("User data:", data.user); // Debug log
          setUser(data.user);
        } else {
          setError(data.error || "Failed to fetch user data");
          localStorage.removeItem("token");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("/api/auth/session", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
    localStorage.removeItem("token");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Student Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Student Information Card */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-24 h-24">
                <img
                  src={user.student?.profileImage || "/public/icons/girl.png"}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-500">Name:</span>{" "}
                <span className="text-gray-900">{user.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Username:</span>{" "}
                <span className="text-gray-900">{user.username}</span>
              </div>
              {user.student && (
                <>
                  <div>
                    <span className="font-medium text-gray-500">Roll Number:</span>{" "}
                    <span className="text-gray-900">{user.student.rollNo}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Class:</span>{" "}
                    <span className="text-gray-900">
                      {user.student.class?.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">School:</span>{" "}
                    <span className="text-gray-900">
                      {user.student.class?.school?.name || "N/A"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
            <div className="grid gap-4">
              <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                View Attendance
              </button>
              <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                View Grades
              </button>
              <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                View Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-6 rounded-lg bg-blue-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-blue-900">
            Welcome, {user.name}!
          </h2>
          <p className="text-blue-700">
            You have successfully logged in to your student dashboard. Here you can
            access your academic information, attendance records, and more.
          </p>
        </div>
      </main>
    </div>
  );
}