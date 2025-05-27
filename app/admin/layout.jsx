"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/schools", label: "Schools", icon: "🏫" },
    { href: "/admin/mentors", label: "Mentors", icon: "👨‍💼" },
    { href: "/admin/admins", label: "Admins", icon: "👑" },
    { href: "/admin/content", label: "Content", icon: "🎬" },
    { href: "/admin/class", label: "Class", icon: "👥" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },


  ];

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return( 
  
    <div className="flex h-screen ">
      {/* Sidebar */}
      <aside
        className={` fixed inset-y-0 z-50 flex flex-col border-r transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } lg:static`}
      >
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex w-full items-center justify-between">
          <h1 className={`font-bold text-lg ${isSidebarOpen ? "block" : "hidden"}`}>
            Daksh Admin
          </h1>
          <ModeToggle />
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border lg:hidden"
          >
            <span className="sr-only">Toggle sidebar</span>
            {isSidebarOpen ? "✕" : "≡"}
          </button>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className={isSidebarOpen ? "block" : "hidden"}>{item.label}</span>
                </Link>

                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t p-4">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? "block" : "hidden"}`}>
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              A
            </div>
            <div>
              <div className="font-medium">Admin User</div>
              <div className="text-xs text-gray-500">admin@example.com</div>
            </div>
          </div>
          <button
            className={`mt-4 w-full rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-900 px-4 lg:px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border lg:hidden"
          >
            <span className="sr-only">Toggle sidebar</span>
            {isSidebarOpen ? "✕" : "≡"}
          </button>
          <div className="w-full flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              {navItems.find((item) => pathname.startsWith(item.href))?.label || "Dashboard"}
            </h1>
            <div className="flex items-center gap-4">
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100">
                🔔
              </button>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100">
                ❓
              </button>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 lg:p-6">{children}</div>
      </main>
    </div>
    
  );
}