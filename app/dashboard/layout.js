"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/home", label: "Home", icon: "🏠" },
    { href: "/dashboard/explore", label: "Explore", icon: "🔍" },
    { href: "/dashboard/learn", label: "Learn", icon: "📚" },
    { href: "/dashboard/reels", label: "Reels", icon: "📱" },
    { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 p-2 w-full ${
                  isActive
                    ? "text-black font-semibold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}