"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MentorDashboardLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/mentor/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/mentor/dashboard/upload", label: "Upload Content", icon: "📤" },
    { href: "/mentor/dashboard/chat", label: "Chat", icon: "💬" },
    { href: "/mentor/dashboard/calls", label: "Calls", icon: "📞" },
    { href: "/mentor/dashboard/reels", label: "Reels", icon: "📱" },
    { href: "/mentor/dashboard/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold">Daksh Mentor</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-black focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <span className="text-xl">🔔</span>
                </button>
                <div className="ml-3 relative">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      M
                    </div>
                    <span className="hidden lg:block">Mentor User</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block bg-white border-r">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center py-2 text-xs ${
                    isActive ? "text-black" : "text-gray-500"
                  }`}
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">{children}</main>
      </div>
    </div>
  );
}