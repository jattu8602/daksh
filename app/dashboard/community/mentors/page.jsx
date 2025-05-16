"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function MentorsPage() {
  const chats = [
    {
      id: 1,
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      name: "learn.with.hanshika",
      message: "You are welcome",
      time: "now",
      isOnline: true,
    },
    {
      id: 2,
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      name: "physics.by.bassi",
      message: "Were you able to submit?",
      time: "2m",
    },
    {
      id: 3,
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      name: "solve.with.sinha_1",
      message: "Do review your mistakes carefully.",
      time: "20m",
    },
    {
      id: 4,
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      name: "learn.with.ranjan",
      message: "Text me in case of any doubts.",
      time: "1h",
    },
    {
      id: 5,
      avatar: "https://randomuser.me/api/portraits/women/62.jpg",
      name: "revise.with.radhika",
      message: "We will do the next quiz tomorrow.",
      time: "5h",
    },
    {
      id: 6,
      avatar: "https://randomuser.me/api/portraits/men/72.jpg",
      name: "excel.with.shubham",
      message: "Text me in case of any doubts.",
      time: "12h",
    },
    {
      id: 7,
      avatar: "https://randomuser.me/api/portraits/men/82.jpg",
      name: "solve.with.rajesh",
      message: "Practice more.",
      time: "1d",
    },
    {
      id: 8,
      avatar: "https://randomuser.me/api/portraits/women/92.jpg",
      name: "learn.with.siya",
      message: "Text me in case of any doubts.",
      time: "1d",
    },
    {
      id: 9,
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      name: "ankita.maam_science",
      message: "New study material uploaded!",
      time: "2h ago",
      isLive: true,
    },
    {
      id: 10,
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      name: "maths.with.mohit",
      message: "Practice test tomorrow",
      time: "3h ago",
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
