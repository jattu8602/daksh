"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "../../globals.css";

export default function LearnLayout({ children }) {
  const pathname = usePathname();

  const tabs = [
    "/dashboard/learn",
    "/dashboard/learn/statistics",
    "/dashboard/learn/rewards",
  ];

  // Fix the active index calculation
  let activeIndex = 0; // Default to the first tab

  // Check for exact path match first
  const exactMatchIndex = tabs.findIndex(tab => tab === pathname);
  if (exactMatchIndex !== -1) {
    activeIndex = exactMatchIndex;
  } else {
    // If no exact match, find the most specific match
    // Sort tabs by length (most specific first) to avoid partial matches
    const sortedTabs = [...tabs].sort((a, b) => b.length - a.length);

    for (const tab of sortedTabs) {
      if (pathname.startsWith(tab)) {
        activeIndex = tabs.indexOf(tab);
        break;
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-center">Daksh</h1>
          <nav className="relative flex justify-center mt-4">
            <div className="grid grid-cols-3 w-full max-w-md border-b relative">
              {tabs.map((path, index) => {
                const isActive = index === activeIndex;
                const iconColor = isActive ? "text-black" : "text-gray-500";
                const labelClass = isActive
                  ? "text-sm font-medium text-black"
                  : "text-sm text-gray-500";

                const icons = [
                  // Learn icon
                  <svg
                    key="learn"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`mb-1 ${iconColor}`}
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>,
                  // Statistics icon
                  <svg
                    key="stats"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`mb-1 ${iconColor}`}
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>,
                  // Rewards icon
                  <svg
                    key="rewards"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`mb-1 ${iconColor}`}
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>,
                ];

                const labels = ["Learn", "Statistics", "Rewards"];

                return (
                  <Link
                    key={path}
                    href={path}
                    className="flex flex-col items-center py-2 px-4 hover:bg-gray-50 transition-all"
                  >
                    {icons[index]}
                    <span className={labelClass}>{labels[index]}</span>
                  </Link>
                );
              })}

              {/* Bottom tab indicator with improved animation */}
              <div
                className="absolute bottom-0 h-0.5 bg-black transition-all duration-300 ease-in-out"
                style={{
                  width: "33.3333%",
                  left: `${activeIndex * 33.3333}%`,
                }}
              />
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}