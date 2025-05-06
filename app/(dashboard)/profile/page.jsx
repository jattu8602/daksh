"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [user] = useState({
    name: "John Doe",
    username: "john_student123",
    rollNumber: "A12345",
    class: "10th Grade",
    school: "Daksh High School",
    qrCode: "/placeholder-qr-code.png",
  });

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-100 p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white mb-3">
            {user.name.split(" ").map(name => name[0]).join("")}
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">Student</p>
        </div>

        <div className="p-4 space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Student Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Roll Number:</span>
                <span className="font-medium">{user.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <span className="font-medium">{user.class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">School:</span>
                <span className="font-medium">{user.school}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">QR Code</h3>
            <div className="flex justify-center">
              <div className="border-2 border-dashed border-gray-300 p-3 rounded-lg">
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">QR Code</p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">Use this QR code for quick login</p>
          </div>

          <div className="pt-4">
            <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}