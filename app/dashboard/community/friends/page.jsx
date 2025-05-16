"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function FriendsPage() {
  const chats = [
    {
      id: 1,
      name: "mohit.panjwani_25",
      message: "Hey, how's it going?",
      time: "9:45 AM",
      avatar: "https://randomuser.me/api/portraits/men/25.jpg",
      isOnline: true,
    },
    {
      id: 2,
      name: "sakshi.shukla_03",
      message: "Let's study together!",
      time: "Yesterday",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      isLive: true,
    },
    {
      id: 3,
      name: "rohan.shukla_24",
      message: "Can we discuss the math problems?",
      time: "10:30 AM",
      avatar: "https://randomuser.me/api/portraits/men/24.jpg",
      isOnline: true,
    },
    {
      id: 4,
      name: "radhika.singh_94",
      message: "Group study session tomorrow?",
      time: "Yesterday",
      avatar: "https://randomuser.me/api/portraits/women/34.jpg",
    },
    {
      id: 5,
      name: "nirupam.biswas_24",
      message: "Physics notes shared!",
      time: "2h ago",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      isLive: true,
    },
    {
      id: 6,
      name: "supratim.das_98",
      message: "Chemistry lab tomorrow",
      time: "3h ago",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      isOnline: true,
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <AnimatePresence>
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/dashboard/community/direct-chat/${chat.id}`}>
              <div className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img
                      src={chat.avatar}
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
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
