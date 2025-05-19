"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Hash, Plus, X, RefreshCw } from "lucide-react"
import { toast } from "react-hot-toast"

export default function HashtagManager() {
  const [hashtags, setHashtags] = useState([])
  const [newTag, setNewTag] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [content, setContent] = useState("")

  // Fetch existing hashtags on component mount
  useEffect(() => {
    fetchExistingTags()
  }, [])

  const fetchExistingTags = async () => {
    try {
      const response = await fetch("/api/hashtags")
      if (!response.ok) throw new Error("Failed to fetch hashtags")
      const data = await response.json()
      setHashtags(data.tags)
    } catch (error) {
      console.error("Error fetching hashtags:", error)
    }
  }

  const generateHashtags = async () => {
    if (!content) {
      toast.error("Please provide some content to generate hashtags")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-hashtags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) throw new Error("Failed to generate hashtags")

      const data = await response.json()
      setSuggestions(data.hashtags)
    } catch (error) {
      toast.error("Failed to generate hashtags")
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const addHashtag = (tag) => {
    const formattedTag = tag.startsWith("#") ? tag : `#${tag}`
    if (!hashtags.includes(formattedTag)) {
      setHashtags([...hashtags, formattedTag])
      setNewTag("")
    }
  }

  const removeHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newTag) {
      e.preventDefault()
      addHashtag(newTag)
    }
  }

  return (
    <div className="space-y-6">
      {/* Content Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content for AI Analysis
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Enter content to generate relevant hashtags..."
        />
        <button
          onClick={generateHashtags}
          disabled={isGenerating}
          className="mt-2 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Generating..." : "Generate Hashtags"}
        </button>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h3 className="text-lg font-medium text-gray-900">AI Suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((tag, index) => (
              <button
                key={index}
                onClick={() => addHashtag(tag)}
                className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Manual Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Hashtags
        </label>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type a hashtag and press Enter"
            />
          </div>
          <button
            onClick={() => addHashtag(newTag)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected Hashtags */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Selected Hashtags</h3>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
            >
              <Hash className="w-4 h-4 mr-1" />
              {tag}
              <button
                onClick={() => removeHashtag(tag)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}