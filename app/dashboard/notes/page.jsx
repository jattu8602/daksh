'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Palette, Grid3X3, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from './components/empty-state'
import { NoteCard } from './components/note-card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

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

export default function NotesPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [notes, setNotes] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [newTaskText, setNewTaskText] = useState('')
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [showBulkColorPicker, setShowBulkColorPicker] = useState(false)
  const longPressTimer = useRef(null)

  // Initialize mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load notes from localStorage on mount
  useEffect(() => {
    if (!mounted) return

    try {
      const savedNotes = localStorage.getItem('dashboard-notes')
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes).map((note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(parsedNotes)

        // Extract all tasks from all notes
        const tasks = parsedNotes.flatMap((note) => note.tasks || [])
        setAllTasks(tasks)
      }
    } catch (error) {
      console.error('Failed to load notes:', error)
    }
  }, [mounted])

  // Toggle select all notes
  useEffect(() => {
    if (selectAll && notes.length > 0) {
      const allIds = new Set(notes.map((note) => note.id))
      setSelectedNotes(allIds)
    } else {
      setSelectedNotes(new Set())
    }
  }, [selectAll, notes])

  const addNewTask = () => {
    if (!newTaskText.trim()) return

    const taskColors = ['#06b6d4', '#f97316', '#22c55e', '#ec4899', '#8b5cf6']
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      color: taskColors[allTasks.length % taskColors.length],
    }

    // Create a new note with this task
    const newNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newTaskText.trim(),
      content: '',
      color: '#ffffff',
      tasks: [newTask],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedNotes = [newNote, ...notes]
    setNotes(updatedNotes)
    setAllTasks([newTask, ...allTasks])
    localStorage.setItem('dashboard-notes', JSON.stringify(updatedNotes))
    setNewTaskText('')
  }

  const toggleTask = (taskId) => {
    const updatedTasks = allTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    setAllTasks(updatedTasks)

    // Update the task in the corresponding note
    const updatedNotes = notes.map((note) => ({
      ...note,
      tasks: (note.tasks || []).map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }))
    setNotes(updatedNotes)
    localStorage.setItem('dashboard-notes', JSON.stringify(updatedNotes))
  }

  const startSelectionMode = () => {
    setIsSelectionMode(true)
    setSelectedNotes(new Set())
    setSelectAll(false)
  }

  const cancelSelection = () => {
    setIsSelectionMode(false)
    setSelectedNotes(new Set())
    setSelectAll(false)
    setShowBulkColorPicker(false)
  }

  const toggleNoteSelection = (noteId) => {
    const newSelected = new Set(selectedNotes)
    if (newSelected.has(noteId)) {
      newSelected.delete(noteId)
    } else {
      newSelected.add(noteId)
    }
    setSelectedNotes(newSelected)

    // Update selectAll state based on current selection
    if (newSelected.size === notes.length) {
      setSelectAll(true)
    } else if (selectAll) {
      setSelectAll(false)
    }
  }

  const deleteSelectedNotes = () => {
    if (selectedNotes.size === 0) return

    const confirmMessage = `Are you sure you want to delete ${
      selectedNotes.size
    } selected note${
      selectedNotes.size > 1 ? 's' : ''
    }? This action cannot be undone.`

    if (confirm(confirmMessage)) {
      const updatedNotes = notes.filter((note) => !selectedNotes.has(note.id))
      setNotes(updatedNotes)
      localStorage.setItem('dashboard-notes', JSON.stringify(updatedNotes))
      cancelSelection()
    }
  }

  const handleColorClick = (colorValue) => {
    if (isSelectionMode) {
      // Select/deselect all notes of this color
      const colorNotes = notes
        .filter((note) => note.color === colorValue)
        .map((note) => note.id)
      const allColorSelected = colorNotes.every((id) => selectedNotes.has(id))

      const newSelected = new Set(selectedNotes)
      colorNotes.forEach((id) => {
        if (allColorSelected) {
          newSelected.delete(id)
        } else {
          newSelected.add(id)
        }
      })
      setSelectedNotes(newSelected)
    } else {
      // Toggle color filter
      setSelectedColor(selectedColor === colorValue ? null : colorValue)
    }
  }

  const updateNoteColors = (newColor) => {
    if (selectedNotes.size === 0) return

    const updatedNotes = notes.map((note) => {
      if (selectedNotes.has(note.id)) {
        return { ...note, color: newColor }
      }
      return note
    })
    setNotes(updatedNotes)
    localStorage.setItem('dashboard-notes', JSON.stringify(updatedNotes))
    setShowBulkColorPicker(false)
  }

  const handleLongPressStart = (noteId) => {
    longPressTimer.current = setTimeout(() => {
      if (!isSelectionMode) {
        startSelectionMode()
        toggleNoteSelection(noteId)
      }
    }, 500)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  // Filter notes and tasks based on selected color
  const filteredNotes = selectedColor
    ? notes.filter((note) => note.color === selectedColor)
    : notes

  const filteredTasks = selectedColor
    ? allTasks.filter((task) => {
        const note = notes.find((n) => n.tasks?.some((t) => t.id === task.id))
        return note && note.color === selectedColor
      })
    : allTasks

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Mobile Layout Only
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-4 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {isSelectionMode ? `${selectedNotes.size} selected` : 'Notes'}
          </h1>
          <div className="flex items-center gap-2">
            {isSelectionMode ? (
              <Button
                variant="outline"
                onClick={cancelSelection}
                className="h-8 text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={startSelectionMode}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={startSelectionMode}
                >
                  <Palette className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Select All (in selection mode) */}
        {isSelectionMode && (
          <div className="mb-4">
            <div
              className="flex items-center gap-3 p-3 bg-card rounded-lg cursor-pointer w-fit"
              onClick={() => setSelectAll(!selectAll)}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded border border-border">
                {selectAll && <Check className="h-3 w-3" />}
              </div>
              <span className="font-medium text-sm">Select All Notes</span>
            </div>
          </div>
        )}

        {/* Color Filter */}
        <div className="mb-4">
          <div className="flex items-center gap-2 p-2 border border-none rounded-lg overflow-x-auto scrollbar-hide">
            <Button
              variant={selectedColor === null ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedColor(null)}
              className="whitespace-nowrap flex-shrink-0 text-xs h-7 px-3"
            >
              All
            </Button>
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorClick(color.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all flex-shrink-0 ${
                  selectedColor === color.value
                    ? 'border-foreground scale-120'
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

        {/* Add Task Input */}
        {!isSelectionMode && (
          <div className="mb-4">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg dark:bg-background">
              <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Type something..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
                className="border-none bg-background text-base placeholder:text-muted-foreground px-0 dark:bg-background
             shadow-none focus:shadow-none focus-visible:shadow-none
             ring-0 focus:ring-0 focus-visible:ring-0 "
              />
            </div>
          </div>
        )}

        {/* Content Area - Show Notes as Simple List Items */}
        <div className="mb-20">
          {filteredNotes.length > 0 ? (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`flex items-center justify-between cursor-pointer p-3 bg-background rounded-lg dark:bg-background ${
                    isSelectionMode ? '' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    if (isSelectionMode) {
                      toggleNoteSelection(note.id)
                    } else {
                      router.push(`/dashboard/notes/${note.id}`)
                    }
                  }}
                  onTouchStart={() => handleLongPressStart(note.id)}
                  onTouchEnd={handleLongPressEnd}
                  onMouseDown={() => handleLongPressStart(note.id)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedNotes.has(note.id)}
                      onCheckedChange={() => toggleNoteSelection(note.id)}
                      className="h-4 w-4 border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-base text-foreground">
                      {note.title || 'Untitled'}
                    </span>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        note.color === '#ffffff' ? 'var(--border)' : note.color,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="h-4 w-4 border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span
                      className={`text-base ${
                        task.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: task.color }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Floating Action Button (only when not in selection mode) */}
        {!isSelectionMode && (
          <Link href="/dashboard/notes/new">
            <div className="fixed bottom-20 right-4 z-50">
              <Button
                size="lg"
                className="h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg"
              >
                <Plus className="h-5 w-5 text-white" />
              </Button>
            </div>
          </Link>
        )}

        {/* Selection Mode Action Buttons */}
        {isSelectionMode && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={cancelSelection}
              className="bg-background shadow-lg text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkColorPicker(!showBulkColorPicker)}
              className="bg-background shadow-lg text-xs"
            >
              <Palette className="h-3 w-3 mr-1" />
              Color
            </Button>

            <Button
              size="sm"
              onClick={deleteSelectedNotes}
              disabled={selectedNotes.size === 0}
              className="bg-red-500 hover:bg-red-600 shadow-lg text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        )}

        {/* Bulk Color Picker */}
        {showBulkColorPicker && (
          <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50 bg-card p-3 rounded-xl shadow-lg border border-border">
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  className="w-6 h-6 rounded-full border-2 border-border"
                  style={{ backgroundColor: color.value }}
                  onClick={() => updateNoteColors(color.value)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
