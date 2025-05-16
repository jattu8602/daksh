"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRScanner from "./components/QRScanner";
import SplashScreen from './components/SplashScreen';
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function StudentLogin() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/api/auth/session", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.success && data.user) {
            if (data.user.role === "STUDENT") {
              router.push("/dashboard/home");
              return;
            }
          }
          // If session is invalid, remove the token
          localStorage.removeItem("token");
        } catch (error) {
          console.error("Session check error:", error);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, [router]);

  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role: "STUDENT",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.success && data.user) {
        // Create a new session
        const sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.user.id,
          }),
        });

        const sessionData = await sessionResponse.json();

        if (!sessionResponse.ok) {
          throw new Error("Failed to create session");
        }

        // Store the session token
        localStorage.setItem("token", sessionData.session.token);

        // Redirect to student dashboard
        router.replace("/dashboard/home");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setError(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScanSuccess = async (qrData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/qr-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: qrData.username,
          password: qrData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "QR login failed");
      }

      if (data.success && data.user) {
        // Create a new session
        const sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.user.id,
          }),
        });

        const sessionData = await sessionResponse.json();

        if (!sessionResponse.ok) {
          throw new Error("Failed to create session");
        }

        // Store the session token
        localStorage.setItem("token", sessionData.session.token);

        // Redirect to student dashboard
        router.replace("/dashboard/home");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setError(error.message || "Failed to login with QR code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScanError = (error) => {
    setError(error);
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

  return (
    <>
      <SplashScreen />
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

            {error && (
              <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {loginMethod === "credentials" ? (
              <form className="space-y-6" onSubmit={handleCredentialLogin}>
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
                <div className="w-full max-w-sm">
                  <QRScanner
                    onScanSuccess={handleQRScanSuccess}
                    onScanError={handleQRScanError}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Scan your student QR code to login
                </p>
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
    </>
  );
}
