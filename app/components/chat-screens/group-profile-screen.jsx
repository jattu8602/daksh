"use client"

import { ArrowLeft, Settings, UserPlus, Search, Bell, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function GroupProfileScreen({ groupName, groupAvatar, members }) {
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-2 text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span className="font-bold">•••</span>
          {/* Signal Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 9.5C18 5.36 14.64 2 10.5 2C6.36 2 3 5.36 3 9.5C3 13.64 6.36 17 10.5 17C14.64 17 18 13.64 18 9.5Z" fill="black" />
            <path d="M10.5 20C9.67 20 9 20.67 9 21.5C9 22.33 9.67 23 10.5 23C11.33 23 12 22.33 12 21.5C12 20.67 11.33 20 10.5 20Z" fill="black" />
            <path d="M19.5 8C18.67 8 18 8.67 18 9.5C18 10.33 18.67 11 19.5 11C20.33 11 21 10.33 21 9.5C21 8.67 20.33 8 19.5 8Z" fill="black" />
          </svg>
          {/* Battery Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1 9C1 7.89543 1.89543 7 3 7H21C22.1046 7 23 7.89543 23 9V20C23 21.1046 22.1046 22 21 22H3C1.89543 22 1 21.1046 1 20V9Z" fill="black" />
            <path fillRule="evenodd" clipRule="evenodd" d="M5 4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V7H5V4Z" fill="black" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center p-4">
        <Link href="/mobile/group-chat" className="text-black">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-medium text-center flex-1">{groupName}</h1>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full flex items-center justify-center">
          <Settings size={20} />
        </motion.button>
      </div>

      {/* Group Avatar */}
      <motion.div className="flex flex-col items-center mt-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <motion.div className="w-24 h-24 rounded-full overflow-hidden mb-4" whileHover={{ scale: 1.05 }}>
          <img src={groupAvatar || "/placeholder.svg"} alt={groupName} className="w-full h-full object-cover" />
        </motion.div>
        <h2 className="text-xl font-bold">{groupName}</h2>
      </motion.div>

      {/* Action Buttons */}
      <motion.div className="flex justify-around px-8 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <motion.button className="flex flex-col items-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <UserPlus size={20} />
          </div>
          <span className="text-xs">Add</span>
        </motion.button>
        <motion.button className="flex flex-col items-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <Search size={20} />
          </div>
          <span className="text-xs">Search</span>
        </motion.button>
        <motion.button className="flex flex-col items-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <Bell size={20} />
          </div>
          <span className="text-xs">Mute</span>
        </motion.button>
        <motion.button className="flex flex-col items-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <LogOut size={20} />
          </div>
          <span className="text-xs">Leave</span>
        </motion.button>
      </motion.div>

      {/* Members Section */}
      <motion.div className="px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <h3 className="text-lg font-bold mb-4">People</h3>
        <div className="space-y-4">
          {members.map((member, index) => (
            <motion.div key={member.id} className="flex items-center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }} whileHover={{ x: 5 }}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="w-full h-full object-cover" />
                </div>
                {member.isOnline && <motion.div className="absolute bottom-0 right-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{member.name}</h4>
              </div>
              {member.isLive && (
                <motion.div className="px-2 py-1 bg-gray-200 rounded-full flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                  <span className="text-xs font-medium flex items-center">
                    <motion.div className="w-2 h-2 bg-green-500 rounded-full mr-1" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />Live
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
