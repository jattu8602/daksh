'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Palette, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { use } from 'react'

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

export default function EditNotePage({ params }) {
  const router = useRouter()
  const [note, setNote] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const noteId = unwrappedParams.id

  useEffect(() => {
    const savedNotes = localStorage.getItem('dashboard-notes')
    if (savedNotes) {
      const notes = JSON.parse(savedNotes)
      const foundNote = notes.find((n) => n.id === noteId)
      if (foundNote) {
        setNote({
          ...foundNote,
          createdAt: new Date(foundNote.createdAt),
          updatedAt: new Date(foundNote.updatedAt),
        })
      }
    }
  }, [noteId])

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
    router.push('/notes')
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="text-lg font-medium text-foreground">Edit Note</h1>
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
                <div className="absolute top-full right-0 mt-2 p-3 bg-card border border-border rounded-xl shadow-lg z-10 min-w-[180px]">
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setNote({ ...note, color: color.value })
                          setShowColorPicker(false)
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          note.color === color.value
                            ? 'border-foreground scale-110'
                            : 'border-border'
                        }`}
                        style={{
                          backgroundColor: color.value,
                          borderColor:
                            color.border ||
                            (note.color === color.value
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
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-3">Title</h2>
            <Input
              placeholder="Type something..."
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="text-3xl border-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground font-semibold dark:bg-background"
            />
          </div>

          <div className="mb-6">
            <Textarea
              placeholder="Start writing your note..."
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              className="min-h-[250px] border-none px-0 focus-visible:ring-0 bg-background  resize-none placeholder:text-muted-foreground text-base dark:bg-transparent"
            />
          </div>
        </div>

        <div className="fixed bottom-20 left-4 z-40">
          <div
            className="w-4 h-4 rounded-full border-2 border-border"
            style={{
              backgroundColor:
                note.color === '#ffffff' ? 'var(--border)' : note.color,
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
