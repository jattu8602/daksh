'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Palette, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

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

export default function EditNotePage({ params }) {
  const router = useRouter()
  const [note, setNote] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    const savedNotes = localStorage.getItem('dashboard-notes')
    if (savedNotes) {
      const notes = JSON.parse(savedNotes)
      const foundNote = notes.find((n) => n.id === params.id)
      if (foundNote) {
        setNote({
          ...foundNote,
          createdAt: new Date(foundNote.createdAt),
          updatedAt: new Date(foundNote.updatedAt),
        })
      }
    }
  }, [params.id])

  const autoSave = () => {
    if (!note) return

    try {
      const savedNotes = localStorage.getItem('dashboard-notes')
      if (savedNotes) {
        const notes = JSON.parse(savedNotes)
        const updatedNotes = notes.map((n) =>
          n.id === note.id ? { ...note, updatedAt: new Date() } : n
        )
        localStorage.setItem('dashboard-notes', JSON.stringify(updatedNotes))
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }

  const handleBack = () => {
    autoSave()
    router.push('/dashboard/notes')
  }

  useEffect(() => {
    const handleBeforeUnload = () => autoSave()
    const handlePopState = () => autoSave()

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
      autoSave()
    }
  }, [note])

  if (!note) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
              Edit Note
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
                <div className="absolute top-full right-0 mt-2 p-3 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 min-w-[200px]">
                  <div className="grid grid-cols-4 gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setNote({ ...note, color: color.value })
                          setShowColorPicker(false)
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          note.color === color.value
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-300'
                        }`}
                        style={{
                          backgroundColor: color.value,
                          borderColor:
                            color.border ||
                            (note.color === color.value ? '#000' : '#d1d5db'),
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
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Title
            </h2>
            <Input
              placeholder="Type something..."
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="text-lg md:text-xl border-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-gray-400 font-normal"
            />
          </div>

          <div className="mb-8">
            <Textarea
              placeholder="Start writing your note..."
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              className="min-h-[300px] md:min-h-[400px] border-none px-0 focus-visible:ring-0 bg-transparent resize-none placeholder:text-gray-400 text-base md:text-lg"
            />
          </div>
        </div>

        <div className="fixed bottom-6 left-6 z-40">
          <div
            className="w-4 h-4 rounded-full border-2 border-gray-300"
            style={{
              backgroundColor:
                note.color === '#ffffff' ? '#e5e7eb' : note.color,
            }}
          />
        </div>
      </div>

      {showColorPicker && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowColorPicker(false)}
        />
      )}
    </div>
  )
}
