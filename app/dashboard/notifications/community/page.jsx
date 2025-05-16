"use client"

import { ArrowLeft, Search, GraduationCap, Settings, User, Check } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function CommunityNotificationsScreen() {
  const todayNotifications = [
    {
      avatar: "👩‍🦰",
      name: "Naina.jain_12",
      action: "requested to follow.",
      description: "Please confirm the request.",
      time: "",
      hasButtons: true,
    },
    {
      avatar: "",
      name: "",
      action: "Your live session with Robert Fox starts in 30 min",
      description: "",
      time: "",
      hasButtons: false,
    },
    {
      avatar: "👩‍🦰",
      name: "Naina.jain_12",
      action: "requested to follow.",
      description: "Please confirm the request.",
      time: "",
      hasButtons: true,
    },
  ]

  const yesterdayNotifications = [
    {
      avatar: "👨",
      name: "Ayush.verma_16",
      action: "liked the post.",
      description: "",
      time: "12h",
      hasButtons: false,
      hasImage: true,
    },
    {
      avatar: "👩",
      name: "Kirti.patel_10",
      action: "",
      description: "",
      time: "5m",
      hasButtons: true,
    },
    {
      avatar: "👩‍🦱",
      name: "Doubt Solved by Shruti Sharma",
      action: "",
      description: "",
      time: "20h",
      hasButtons: false,
      hasCheckbox: true,
    },
    {
      avatar: "👩‍🦰",
      name: "Doubt Solved by Hanshika Dev",
      action: "",
      description: "",
      time: "22h",
      hasButtons: false,
      hasCheckbox: true,
    },
    {
      avatar: "👩",
      name: "Doubt Solved by Rashmika",
      action: "",
      description: "",
      time: "20h",
      hasButtons: false,
      hasCheckbox: true,
      hasGreenDot: true,
    },
    {
      avatar: "👩‍🦱",
      name: "Doubt Solved by Shruti Sharma",
      action: "",
      description: "",
      time: "12h",
      hasButtons: false,
      hasCheckbox: true,
    },
    {
      avatar: "👩‍🦰",
      name: "Doubt Solved by Hanshika Dev",
      action: "",
      description: "",
      time: "22h",
      hasButtons: false,
      hasCheckbox: true,
    },
    {
      avatar: "👥",
      name: "Your friends miss you",
      action: "",
      description: "Your friends in the Challenge are",
      time: "",
      hasButtons: false,
      hasActionButton: true,
    },
    {
      avatar: "👥",
      name: "You have new followers!",
      action: "",
      description: "Akari Mi just followed you. 8h",
      time: "",
      hasButtons: false,
      hasGreenDot: true,
    },
    {
      avatar: "💬",
      name: "You have unread messages!",
      action: "",
      description: "56 Total Unread messages.",
      time: "",
      hasButtons: false,
      hasGreenDot: true,
    },
    {
      avatar: "💬",
      name: "Someone commented!",
      action: "",
      description: "Dr.Haikari commented on your post.",
      time: "",
      hasButtons: false,
    },
    {
      avatar: "🎬",
      name: "Someone posted new video!",
      action: "",
      description: "Joe Biden posted new video.",
      time: "",
      hasButtons: false,
    },
    {
      avatar: "📝",
      name: "Someone mentioned you!",
      action: "",
      description: "JoeMakima 5 just mentioned you.",
      time: "",
      hasButtons: false,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">


      {/* Today Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="px-4 py-3"
      >
        <h2 className="text-lg font-bold">Today</h2>
      </motion.div>

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
            {notification.avatar && (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-lg">{notification.avatar}</span>
              </div>
            )}
            <div className="flex-1">
              {notification.name && <h3 className="font-medium">{notification.name}</h3>}
              <p className="text-gray-500 text-sm">{notification.action}</p>
              {notification.description && <p className="text-gray-500 text-sm">{notification.description}</p>}
            </div>
            {notification.time && <span className="text-gray-400 text-xs ml-2">{notification.time}</span>}

            {notification.hasButtons && (
              <div className="flex gap-2 mt-2">
                <motion.button
                  className="px-4 py-1 bg-black text-white text-sm rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm
                </motion.button>
                <motion.button
                  className="px-4 py-1 bg-gray-200 text-black text-sm rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            )}
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
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-lg">{notification.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium">{notification.name}</h3>
                {notification.hasGreenDot && (
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full ml-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </div>
              {notification.action && <p className="text-gray-500 text-sm">{notification.action}</p>}
              {notification.description && <p className="text-gray-500 text-sm">{notification.description}</p>}

              {notification.hasButtons && (
                <div className="flex gap-2 mt-2">
                  <motion.button
                    className="px-4 py-1 bg-black text-white text-sm rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Confirm
                  </motion.button>
                  <motion.button
                    className="px-4 py-1 bg-gray-200 text-black text-sm rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </div>
              )}
            </div>
            {notification.time && <span className="text-gray-400 text-xs ml-2">{notification.time}</span>}

            {notification.hasImage && (
              <div className="ml-2 w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-xs">IMG</span>
              </div>
            )}

            {notification.hasCheckbox && (
              <div className="ml-2 w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
                {Math.random() > 0.5 && <Check size={12} />}
              </div>
            )}

            {notification.hasActionButton && (
              <motion.button
                className="ml-2 px-3 py-1 bg-black text-white text-xs rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Take Action
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
