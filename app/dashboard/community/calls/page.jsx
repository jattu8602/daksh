"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function CallsPage() {
  const chats = [
    {
      id: 1,
      avatar: "https://randomuser.me/api/portraits/men/24.jpg",
      name: "rohan.shukla_24",
      message: "Today, 06:01 pm",
      time: "",
      isMissedCall: false,
    },
    {
      id: 2,
      avatar: "https://randomuser.me/api/portraits/women/34.jpg",
      name: "radhika.singh_94",
      message: "Today, 04:15 pm",
      time: "",
      isMissedCall: true,
    },
    {
      id: 3,
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      name: "nirupam.biswas_24",
      message: "Today, 06:15 am",
      time: "",
      isMissedCall: false,
    },
    {
      id: 4,
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      name: "supratim.das_98",
      message: "Yesterday, 10:01 pm",
      time: "",
      isMissedCall: false,
    },
    {
      id: 5,
      avatar: "https://randomuser.me/api/portraits/men/64.jpg",
      name: "ankit.singh_94",
      message: "Yesterday, 07:15 pm",
      time: "",
      isMissedCall: false,
    },
    {
      id: 6,
      avatar: "https://randomuser.me/api/portraits/men/74.jpg",
      name: "rakesh.singh_09",
      message: "29 Feb, 06:15 am",
      time: "",
      isMissedCall: true,
    },
    {
      id: 7,
      avatar: "https://randomuser.me/api/portraits/men/84.jpg",
      name: "subham.mishra_98",
      message: "28 Feb, 09:15 pm",
      time: "",
      isMissedCall: true,
    },
    {
      id: 8,
      avatar: "https://randomuser.me/api/portraits/men/94.jpg",
      name: "kartik.singh_11",
      message: "28 Feb, 06:15 am",
      time: "",
      isMissedCall: false,
    },
    {
      id: 9,
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      name: "ankita.maam_science",
      message: "Today, 11:30 am",
      time: "",
      isMissedCall: true,
    },
    {
      id: 10,
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      name: "physics.by.bassi",
      message: "Today, 10:15 am",
      time: "",
      isMissedCall: false,
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
                <motion.div
                  className="ml-2 w-8 h-8 rounded-full flex items-center justify-center"
                  initial={{ rotate: -45 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Phone size={16} className={chat.isMissedCall ? "text-red-500" : "text-green-500"} />
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
