"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";

// -- Constants
const tabs = ["friends", "mentors", "school", "calls"];

// -- Header Component
function CommunityHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white flex items-center px-4 py-3 border-b">
      <Link href="/dashboard" aria-label="Back to dashboard">
        <ArrowLeft size={24} className="text-black" />
      </Link>
      <h1 className="flex-1 text-center text-lg font-semibold text-black">
        Community
      </h1>
    </header>
  );
}

// -- Tabs Component
function CommunityTabs({ activeTab }) {
  return (
    <nav
      className="sticky top-[100px] z-30 flex justify-around bg-white border-b px-4 py-2"
      role="tablist"
      aria-label="Community Sections"
    >
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Link key={tab} href={`/dashboard/community/${tab}`} scroll={false}>
            <motion.button
              role="tab"
              aria-selected={isActive}
              className={[
                "capitalize px-4 py-2 rounded-full text-sm font-medium",
                isActive ? "bg-black text-white" : "bg-gray-200 text-black",
              ].join(" ")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={false}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {tab}
            </motion.button>
          </Link>
        );
      })}
    </nav>
  );
}

// -- Debounce Hook
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// -- Main Layout
export default function CommunityLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 250);

  // Redirect base path → default tab
  useEffect(() => {
    if (pathname === "/dashboard/community") {
      router.replace("/dashboard/community/friends");
    }
  }, [pathname, router]);

  const activeTab = useMemo(() => {
    return tabs.find((t) => pathname.endsWith(t)) || tabs[0];
  }, [pathname]);

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  // Detect if on group chat screen
  const isGroupChatScreen = /\/dashboard\/community\/school\/group-chat\/.+/.test(pathname);
  const isGroupProfileScreen = /\/dashboard\/community\/school\/group-profile\/.+/.test(pathname);
  const isFullScreenView = isGroupChatScreen || isGroupProfileScreen;

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-white">
      {/* Only show header if not in full screen view */}
      {!isFullScreenView && <CommunityHeader />}

      {/* Search Bar - hide on full screen views */}
      {!isFullScreenView && (
        <motion.div
          className="sticky top-[50px] z-40 bg-white px-4 py-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          aria-label="Search community"
        >
          <div className="flex items-center w-full bg-gray-100 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-500 mr-2" aria-hidden="true" />
            <input
              type="search"
              role="searchbox"
              placeholder="Search..."
              className="w-full bg-transparent border-none outline-none text-sm"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </motion.div>
      )}

      {/* Tabs - hide on full screen views */}
      {!isFullScreenView && <CommunityTabs activeTab={activeTab} />}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className={`flex-1 overflow-y-auto ${!isFullScreenView ? 'px-4 py-3' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
