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
  { name: 'orange', value: '#f97316' },
  { name: 'yellow', value: '#eab308' },
  { name: 'cyan', value: '#06b6d4' },
  { name: 'green', value: '#22c55e' },
  { name: 'pink', value: '#ec4899' },
  { name: 'purple', value: '#8b5cf6' },
  { name: 'blue', value: '#dbeafe' },
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
    // UPDATED PATH
    router.push('/notes')
  }

  useEffect(() => {
    return () => {
      saveNote()
    }
  }, [title, content, selectedColor])

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-orange-500 hover:text-orange-600 h-8 w-8"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium text-foreground">Add Note</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="text-muted-foreground hover:text-foreground h-8 w-8"
              >
                <Palette className="h-5 w-5" />
              </Button>

              {showColorPicker && (
                <div className="absolute top-full right-0 mt-2 p-3 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[180px]">
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color.value)
                          setShowColorPicker(false)
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor === color.value
                            ? 'border-foreground scale-110'
                            : 'border-border'
                        }`}
                        style={{
                          backgroundColor: color.value,
                          borderColor:
                            color.border ||
                            (selectedColor === color.value
                              ? 'var(--foreground)'
                              : 'var(--border)'),
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
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-20">
          {/* Title Input */}
          <Input
            ref={titleRef}
            placeholder="Type something..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold border-none px-0 focus-visible:ring-0 focus:outline-none bg-transparent placeholder:text-muted-foreground mb-4"
          />

          {/* Description / Textarea */}
          <Textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[250px] h-auto border-none px-0 focus-visible:ring-0 focus:outline-none bg-transparent resize-none placeholder:text-muted-foreground text-base"
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </div>

        {/* Color Dot Indicator */}
        <div className="fixed bottom-20 left-4 z-40">
          <div
            className="w-4 h-4 rounded-full border-2 border-border"
            style={{
              backgroundColor:
                selectedColor === '#ffffff' ? 'var(--border)' : selectedColor,
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
