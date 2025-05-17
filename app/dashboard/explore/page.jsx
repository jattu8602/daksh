"use client";

import React, { useState } from "react";
import { Search, Home, PlusSquare, Play, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function SearchScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  const tabs = [
    { id: "all", name: "All" },
    { id: "account", name: "Account" },
    { id: "posts", name: "Posts" },
    { id: "shots", name: "Shots" },
    { id: "videos", name: "Videos" },
  ];

  const searchItems = [
    { id: "1", image: "/placeholder.svg?height=200&width=200", type: "image" },
    { id: "2", image: "/placeholder.svg?height=200&width=200", type: "image", hasQuestion: true },
    { id: "3", image: "/placeholder.svg?height=200&width=200", type: "image" },
    { id: "4", image: "/placeholder.svg?height=300&width=200", type: "video" },
    { id: "5", image: "/placeholder.svg?height=200&width=200", type: "image", hasQuestion: true },
    { id: "6", image: "/placeholder.svg?height=200&width=200", type: "image", hasQuestion: true },
    { id: "7", image: "/placeholder.svg?height=200&width=200", type: "image" },
    { id: "8", image: "/placeholder.svg?height=200&width=200", type: "video" },
    { id: "9", image: "/placeholder.svg?height=200&width=200", type: "image" },
    { id: "10", image: "/placeholder.svg?height=200&width=200", type: "carousel" },
    { id: "11", image: "/placeholder.svg?height=200&width=200", type: "image", hasQuestion: true },
    { id: "12", image: "/placeholder.svg?height=200&width=200", type: "video" },
    { id: "13", image: "/placeholder.svg?height=200&width=200", type: "image" },
    { id: "14", image: "/placeholder.svg?height=200&width=200", type: "image", hasQuestion: true },
    { id: "15", image: "/placeholder.svg?height=200&width=200", type: "video" },
    { id: "16", image: "/placeholder.svg?height=200&width=200", type: "image" },
    { id: "17", image: "/placeholder.svg?height=200&width=200", type: "image", hasQuestion: true },
    { id: "18", image: "/placeholder.svg?height=200&width=200", type: "video" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">


      {/* Search Bar */}
      <motion.div
        className="p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by keyword, topic or subject"
            className="bg-transparent border-none outline-none w-full text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className="text-gray-500">
            {/* Search Settings Icon SVG */}
          </button>
          <button className="text-gray-500 ml-2">
            {/* Filter Icon SVG */}
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex space-x-2 px-5 overflow-x-auto "
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Search Results */}
      <div className="flex-1 overflow-auto mt-4">
        <motion.div
          className="grid grid-cols-3 gap-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {searchItems.map((item, idx) => (
            <motion.div
              key={item.id}
              className="relative aspect-square"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + idx * 0.02 }}
              whileHover={{ scale: 0.98 }}
            >
              <Image
                src={item.image}
                alt={`Result ${item.id}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />

              {item.type === "video" && (
                <motion.div
                  className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.02 }}
                >
                  <Play size={12} className="text-white" />
                </motion.div>
              )}

              {item.type === "carousel" && (
                <motion.div
                  className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.02 }}
                >
                  {/* Carousel SVG */}
                </motion.div>
              )}

              {item.hasQuestion && (
                <motion.div
                  className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.02 }}
                >
                  <span className="text-white text-xs font-bold">?</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>


    </div>
  );
}
