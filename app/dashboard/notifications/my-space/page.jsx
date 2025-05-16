"use client"

import { ArrowLeft, Search, GraduationCap, Settings, User, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function MySpaceNotificationsScreen() {
  const todayNotifications = [
    {
      icon: "🍃",
      title: "Take a break",
      description: "Take a break by relaxing your concentration.",
      time: "Now",
    },
    {
      icon: "✓",
      title: "Complete your daily goals",
      description: "Daily goals help in improving productivity.",
      time: "10m",
    },
  ]

  const yesterdayNotifications = [
    {
      icon: "📝",
      title: "Review test",
      description: "Start test for today.",
      time: "1h",
    },
    {
      icon: "📄",
      title: "Take an application of notes",
      description: "Today by 22:00.",
      time: "2h",
    },
    {
      icon: "📅",
      title: "Start preparation",
      description: "Start today (10am-1pm).",
      time: "3h",
    },
    {
      icon: "☕",
      title: "Take a break",
      description: "Start today (10am-1pm).",
      time: "5h",
    },
    {
      icon: "📚",
      title: "Lesson Completed",
      description: "Sign lesson summary test runs.",
      time: "6h",
    },
    {
      icon: "⭐",
      title: "10 points earned",
      description: "10 points earned.",
      time: "",
      hasGreenDot: true,
    },
    {
      icon: "🏆",
      title: "Challenge completed",
      description: "Winning streak is excellent.",
      time: "",
    },
    {
      icon: "💬",
      title: "Message from Dr. Fraud AI",
      description: "Big final review of messages.",
      time: "8h",
    },
    {
      icon: "✏️",
      title: "Journal incomplete",
      description: "5 reflections incomplete.",
      time: "9h",
    },
    {
      icon: "❤️",
      title: "Mental Health Data is here",
      description: "Monthly mental acceptance is here.",
      time: "10h",
    },
    {
      icon: "📄",
      title: "Stress documented",
      description: "Stress levels recorded.",
      time: "11h",
    },
    {
      icon: "🛡️",
      title: "Account Security Alert",
      description: "New suspicious device detected.",
      time: "",
      hasArrow: true,
    },
    {
      icon: "⚙️",
      title: "System Update Available",
      description: "Update your system to improve security.",
      time: "",
      hasArrow: true,
    },
    {
      icon: "🔑",
      title: "Password Reset Successful",
      description: "Your password has been reset.",
      time: "",
      hasArrow: true,
    },
    {
      icon: "✨",
      title: "Exciting New Feature",
      description: "Try our new feature now.",
      time: "",
      hasArrow: true,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
     
      {/* Today Notifications */}
      <div className="overflow-auto">
        {todayNotifications.map((notification, index) => (
          <motion.div
            key={`today-${index}`}
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

      {/* Yesterday Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="px-4 py-3"
      >
        <h2 className="text-lg font-bold">Yesterday</h2>
      </motion.div>

      {/* Yesterday Notifications */}
      <div className="overflow-auto">
        {yesterdayNotifications.map((notification, index) => (
          <motion.div
            key={`yesterday-${index}`}
            className="flex items-start p-4 border-b border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span>{notification.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium">{notification.title}</h3>
                {notification.hasGreenDot && (
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full ml-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </div>
              <p className="text-gray-500 text-sm">{notification.description}</p>
            </div>
            {notification.hasArrow ? (
              <ChevronRight size={20} className="text-gray-400 ml-2" />
            ) : (
              <span className="text-gray-400 text-xs ml-2">{notification.time}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
