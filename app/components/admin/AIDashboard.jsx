"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wand2, Hash, RefreshCw } from "lucide-react"
import MetaDescriptionGenerator from "./MetaDescriptionGenerator"
import HashtagManager from "./HashtagManager"

export default function AIDashboard() {
  const [activeTab, setActiveTab] = useState("meta")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Content Assistant</h1>
          <p className="mt-2 text-gray-600">Enhance your content with AI-powered tools</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("meta")}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === "meta"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Meta Description Generator
          </button>
          <button
            onClick={() => setActiveTab("hashtags")}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === "hashtags"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Hash className="w-5 h-5 mr-2" />
            Hashtag Manager
          </button>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          {activeTab === "meta" ? (
            <MetaDescriptionGenerator />
          ) : (
            <HashtagManager />
          )}
        </motion.div>
      </div>
    </div>
  )
}