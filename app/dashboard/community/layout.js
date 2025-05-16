"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";

const tabs = ["friends", "mentors", "school", "calls"];

export default function CommunityLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (pathname === "/dashboard/community") {
      router.replace("/dashboard/community/friends");
    }
  }, [pathname]);

  const getActiveTab = () => {
    return tabs.find(tab => pathname.endsWith(tab)) || tabs[0];
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col">
     {/* Top Header */}
<div className="sticky top-0 z-50 bg-white flex items-center p-4 ">
  <Link href="/dashboard" className="text-black">
    <ArrowLeft size={24} />
  </Link>
  <h1 className="text-lg font-semibold text-center flex-1">Community</h1>
</div>

{/* Search */}
<motion.div
  className="sticky top-[64px] z-40 bg-white px-4 py-2 "
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
    <Search size={18} className="text-gray-500 mr-2" />
    <input
      type="text"
      placeholder="Search"
      className="bg-transparent border-none outline-none w-full text-sm"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  </div>
</motion.div>

{/* Tabs */}
<motion.div
  className="sticky top-[112px] z-30 bg-white flex justify-around px-4 py-2 border-b"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {tabs.map((tab) => (
    <Link key={tab} href={`/dashboard/community/${tab}`}>
      <motion.button
        className={`capitalize px-4 py-2 rounded-full text-sm font-medium ${
          pathname.endsWith(tab)
            ? "bg-black text-white"
            : "bg-gray-200 text-black"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={pathname.endsWith(tab) ? { scale: 0.95 } : { scale: 1 }}
        animate={pathname.endsWith(tab) ? { scale: 1 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </motion.button>
    </Link>
  ))}
</motion.div>


      {/* Page Content with Animation */}
      <motion.div
        className="flex-1 overflow-y-auto"
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}