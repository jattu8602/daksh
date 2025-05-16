"use client";

import { ArrowLeft, Search, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function CommunityScreen({ activeTab, chats }) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTab, setSelectedTab] = useState(activeTab);

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      chat.message.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center p-4">
        <Link href="#" >
          <a className="text-black">
            <ArrowLeft size={24} />
          </a>
        </Link>
        <h1 className="text-lg font-medium text-center flex-1">Community</h1>
      </div>

      {/* Search */}
      <motion.div
        className="px-4 mb-4"
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
        className="flex px-4 mb-4 space-x-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {["friends", "mentors", "school", "calls"].map((tab) => (
          <motion.button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedTab === tab ? "bg-black text-white" : "bg-gray-100 text-black"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Chat List */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence>
          {filteredChats.map((chat, index) => {
            const isGroupChat = chat.name === "Official 10-B";
            const isDirectChat = ["mohit.panjwani_25", "ankita.maam_science", "learn.with.hanshika"].includes(
              chat.name
            );
            const linkHref = isGroupChat
              ? "/mobile/group-chat"
              : isDirectChat
              ? "/mobile/direct-chat"
              : "#";

            return (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={linkHref} legacyBehavior>
                  <a className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                        <img
                          src={chat.avatar || "/placeholder.svg"}
                          alt={chat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {chat.isOnline && (
                        <motion.div
                          className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.message}</p>
                    </div>
                    {chat.unread && (
                      <motion.div
                        className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-xs text-white">{chat.unread}</span>
                      </motion.div>
                    )}
                    {chat.isLive && (
                      <motion.div
                        className="ml-2 px-2 py-1 bg-gray-200 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-xs font-medium flex items-center">
                          <motion.div
                            className="w-2 h-2 bg-green-500 rounded-full mr-1"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          Live
                        </span>
                      </motion.div>
                    )}
                    {chat.isMissedCall && (
                      <motion.div
                        className="ml-2 w-8 h-8 rounded-full flex items-center justify-center"
                        initial={{ rotate: -45 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Phone size={16} className="text-red-500" />
                      </motion.div>
                    )}
                  </a>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
