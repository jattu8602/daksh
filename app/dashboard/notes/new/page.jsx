'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Palette, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const COLORS = [
  { name: 'white', value: '#ffffff', border: '#e5e7eb' },
  { name: 'pink', value: '#fce7f3' },
  { name: 'orange', value: '#fed7aa' },
  { name: 'yellow', value: '#fef3c7' },
  { name: 'green', value: '#d1fae5' },
  { name: 'cyan', value: '#cffafe' },
  { name: 'blue', value: '#dbeafe' },
  { name: 'purple', value: '#e9d5ff' },
]

export default function NewNotePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value)
  const [noteId] = useState(
    () => `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  )
  const [showColorPicker, setShowColorPicker] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus()
  }, [])

  const saveNote = () => {
    if (!title.trim() && !content.trim()) return

    try {
      const savedNotes = localStorage.getItem('dashboard-notes')
      const notes = savedNotes ? JSON.parse(savedNotes) : []

      const existingNoteIndex = notes.findIndex((note) => note.id === noteId)

      const noteData = {
        id: noteId,
        title: title.trim() || 'Untitled',
        content: content.trim(),
        color: selectedColor,
        createdAt:
          existingNoteIndex !== -1
            ? notes[existingNoteIndex].createdAt
            : new Date(),
        updatedAt: new Date(),
      }

      if (existingNoteIndex !== -1) {
        notes[existingNoteIndex] = noteData
      } else {
        notes.unshift(noteData)
      }

      localStorage.setItem('dashboard-notes', JSON.stringify(notes))
    } catch (err) {
      console.error('Failed to save note:', err)
    }
  }

  const handleBack = () => {
    saveNote()
    router.push('/dashboard/notes')
  }

  useEffect(() => {
    return () => {
      saveNote()
    }
  }, [title, content, selectedColor])

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-orange-500 hover:text-orange-600 h-8 w-8 md:h-10 md:w-10"
            >
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <h1 className="text-lg md:text-xl font-medium text-gray-900">
              Add Note
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="text-gray-600 hover:text-gray-800 h-8 w-8 md:h-10 md:w-10"
              >
                <Palette className="h-5 w-5 md:h-6 md:w-6" />
              </Button>

              {showColorPicker && (
                <div className="absolute top-full right-0 mt-2 p-3 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 min-w-[200px]">
                  <div className="grid grid-cols-4 gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color.value)
                          setShowColorPicker(false)
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color.value
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-300'
                        }`}
                        style={{
                          backgroundColor: color.value,
                          borderColor:
                            color.border ||
                            (selectedColor === color.value
                              ? '#000'
                              : '#d1d5db'),
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-gray-800 h-8 w-8 md:h-10 md:w-10"
            >
              <MoreHorizontal className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 md:px-6 py-4 md:py-6">
          {/* Title Input */}
          <Input
            ref={titleRef}
            placeholder="Type something..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl md:text-4xl font-semibold border-none px-0 focus-visible:ring-0 focus:outline-none bg-transparent placeholder:text-gray-400 mb-6"
          />

          {/* Description / Textarea */}
          <Textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] h-auto border-none px-0 focus-visible:ring-0 focus:outline-none bg-transparent resize-none placeholder:text-gray-400 text-base md:text-lg"
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </div>

        {/* Color Dot Indicator */}
        <div className="fixed bottom-6 left-6 z-40">
          <div
            className="w-4 h-4 rounded-full border-2 border-gray-300"
            style={{
              backgroundColor:
                selectedColor === '#ffffff' ? '#e5e7eb' : selectedColor,
            }}
          />
        </div>
      </div>

      {/* Overlay to close color picker */}
      {showColorPicker && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowColorPicker(false)}
        />
      )}
    </motion.div>
  )
}
