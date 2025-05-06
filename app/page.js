"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StudentLogin() {
  const [loginMethod, setLoginMethod] = useState("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // This would be replaced with actual API call
    console.log("Logging in with:", { username, password });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Redirect would happen here after successful login
      window.location.href = "/dashboard/home";
    }, 1500);
  };

  const handleQRLogin = () => {
    // QR code scanning logic would go here
    console.log("QR login clicked");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Daksh</h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Student Login
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your student dashboard
          </p>
        </div>

        <div className="mt-8 bg-white p-6 shadow rounded-lg">
          <div className="flex border-b mb-6">
            <button
              className={`pb-2 px-4 ${
                loginMethod === "credentials"
                  ? "border-b-2 border-black font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setLoginMethod("credentials")}
            >
              Username & Password
            </button>
            <button
              className={`pb-2 px-4 ${
                loginMethod === "qr"
                  ? "border-b-2 border-black font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setLoginMethod("qr")}
            >
              QR Code
            </button>
          </div>

          {loginMethod === "credentials" ? (
            <form
              className="space-y-6"
              onSubmit={handleCredentialLogin}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="h-48 w-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">QR Code Scanner</p>
              </div>
              <button
                onClick={handleQRLogin}
                className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Scan QR Code
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-sm">
          <div className="text-gray-600">
            Admin?{" "}
            <Link href="/admin/login" className="font-medium text-black hover:text-gray-800">
              Login here
            </Link>
          </div>
          <div className="mt-2 text-gray-600">
            Mentor?{" "}
            <Link href="/mentor/login" className="font-medium text-black hover:text-gray-800">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
