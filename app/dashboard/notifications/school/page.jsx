"use client"

import { ArrowLeft, Search, GraduationCap, Settings, User } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function SchoolNotificationsScreen() {
  const notifications = [
    {
      icon: "👨‍🏫",
      title: "Chemistry live class",
      description: "Start today (10am-1pm) by VR Sharma.",
      time: "1h",
    },
    {
      icon: "❓",
      title: "Quiz (Physics)",
      description: "Start by today 7 April - 16 April for all Subjects.",
      time: "1h",
    },
    {
      icon: "❓",
      title: "Quiz (First Term)",
      description: "Today by 2pm. Be ready and all the best!",
      time: "1h",
    },
    {
      icon: "📄",
      title: "Notice",
      description: "Dear students kindly attend the class, lack of attendance may restrict your",
      time: "1h",
    },
    {
      icon: "📄",
      title: "Notice",
      description: "Gently reminder: 12 April is a Holiday due to 'Holi Festival'.",
      time: "1h",
    },
    {
      icon: "📄",
      title: "Notice",
      description: "Dear student, kindly complete the fee payment. Please ignore if already paid.",
      time: "1h",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      
      {/* Notifications */}
      <div className="flex-1 overflow-auto">
        {notifications.map((notification, index) => (
          <motion.div
            key={index}
            className="flex items-start p-4 border-b border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span>{notification.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-gray-500 text-sm">{notification.description}</p>
            </div>
            <span className="text-gray-400 text-xs ml-2">{notification.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
