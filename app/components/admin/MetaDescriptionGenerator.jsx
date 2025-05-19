"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, Copy, Check, Save, Hash } from "lucide-react"
import { toast } from "react-hot-toast"

export default function MetaDescriptionGenerator({ videoId, initialTitle = "", initialDescription = "" }) {
  const [title, setTitle] = useState(initialTitle)
  const [originalDesc, setOriginalDesc] = useState(initialDescription)
  const [aiDesc, setAiDesc] = useState("")
  const [hashtags, setHashtags] = useState([])
  const [temperature, setTemperature] = useState(0.7)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (initialTitle) setTitle(initialTitle)
    if (initialDescription) setOriginalDesc(initialDescription)
  }, [initialTitle, initialDescription])

  const generateDescription = async () => {
    if (!title || !originalDesc) {
      toast.error("Please provide both title and original description")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-meta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          originalDesc,
          temperature,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate description")

      const data = await response.json()
      setAiDesc(data.description)
      if (data.hashtags) {
        setHashtags(data.hashtags)
      }
    } catch (error) {
      toast.error("Failed to generate description")
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveToDatabase = async () => {
    if (!videoId) {
      toast.error("Video ID is required")
      return
    }

    if (!aiDesc) {
      toast.error("Please generate a description first")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/videos/update-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          metaDescription: aiDesc,
          hashtags,
        }),
      })

      if (!response.ok) throw new Error("Failed to save metadata")

      toast.success("Metadata saved successfully!")
    } catch (error) {
      toast.error("Failed to save metadata")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      const textToCopy = `${aiDesc}\n\n${hashtags.map(tag => `#${tag}`).join(" ")}`
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const charCount = aiDesc.length
  const isOptimalLength = charCount >= 60 && charCount <= 160

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter video title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Description
          </label>
          <textarea
            value={originalDesc}
            onChange={(e) => setOriginalDesc(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Enter original description"
          />
        </div>
      </div>

      {/* Temperature Control */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">
          Temperature: {temperature.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-48"
        />
        <button
          onClick={generateDescription}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* AI Generated Content */}
      {aiDesc && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">AI Generated Content</h3>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isOptimalLength ? "text-green-600" : "text-red-600"}`}>
                {charCount} characters
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              {videoId && (
                <button
                  onClick={saveToDatabase}
                  disabled={isSaving}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className={`w-4 h-4 mr-2 ${isSaving ? "animate-spin" : ""}`} />
                  {isSaving ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{aiDesc}</p>
          </div>

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Hash className="w-4 h-4 mr-2 text-gray-500" />
                <h4 className="text-sm font-medium text-gray-700">Generated Hashtags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}