"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function SchoolPage() {
  const chats = [
    {
      id: 1,
      name: "Official 10-B",
      message: "Akshat: Please share som.....",
      time: "6:11 pm",
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
      unread: 1,
    },
    {
      id: 2,
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      name: "ankita.maam_science",
      message: "Do revise more.",
      time: "3h",
    },
    {
      id: 3,
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
      name: "payal.maam_english",
      message: "Have you done the vocab quiz?",
      time: "2h",
    },
    {
      id: 4,
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      name: "parul.maam_english",
      message: "Have you done the homework?",
      time: "6h",
    },
    {
      id: 5,
      avatar: "https://randomuser.me/api/portraits/women/75.jpg",
      name: "ayushi.maam_hindi",
      message: "Let me know in case of any doubts.",
      time: "6h",
    },
    {
      id: 6,
      avatar: "https://randomuser.me/api/portraits/women/85.jpg",
      name: "akansha.maam_english",
      message: "Have you done the recent quiz?",
      time: "1d",
    },
    {
      id: 7,
      avatar: "https://randomuser.me/api/portraits/men/95.jpg",
      name: "raghav.sir_maths",
      message: "Be ready for tomorrow's test!",
      time: "1d",
    },
    {
      id: 8,
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
      name: "payal.maam_english",
      message: "Have you done the vocab quiz?",
      time: "2h",
    },
    {
      id: 9,
      avatar: "https://randomuser.me/api/portraits/men/25.jpg",
      name: "sports.sir_rajesh",
      message: "Sports day practice tomorrow",
      time: "1h ago",
      isLive: true,
    },
    {
      id: 10,
      avatar: "https://randomuser.me/api/portraits/women/35.jpg",
      name: "art.maam_priya",
      message: "Art competition next week",
      time: "2h ago",
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
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
