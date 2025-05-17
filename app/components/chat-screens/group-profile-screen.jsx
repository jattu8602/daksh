"use client"

import { ArrowLeft, Settings, UserPlus, Search, Bell, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function GroupProfileScreen({ groupName, groupAvatar, members }) {
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
    
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
