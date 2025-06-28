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
  const [notes, setNotes] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [newTaskText, setNewTaskText] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [showBulkColorPicker, setShowBulkColorPicker] = useState(false)
  const longPressTimer = useRef(null)

  // Initialize mounted, mobile detection
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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

  // Long press handlers
  const handleLongPressStart = (noteId) => {
    if (isSelectionMode) return

    longPressTimer.current = setTimeout(() => {
      if (!isSelectionMode) {
        setIsSelectionMode(true)
      }
      toggleNoteSelection(noteId)
      longPressTimer.current = null
    }, 500) // 500ms for long press
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const filteredTasks = selectedColor
    ? allTasks.filter((task) => task.color === selectedColor)
    : allTasks
  const filteredNotes = selectedColor
    ? notes.filter((note) => note.color === selectedColor)
    : notes

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isSelectionMode ? `${selectedNotes.size} selected` : 'Notes'}
            </h1>
            <div className="flex items-center gap-2">
              {isSelectionMode ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelSelection}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={startSelectionMode}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Palette className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Grid3X3 className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Color Filter */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-x-auto scrollbar-hide shadow-sm">
              <Button
                variant={selectedColor === null ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedColor(null)}
                className="whitespace-nowrap flex-shrink-0 text-sm h-8 px-4 bg-gray-900 text-white hover:bg-gray-800"
              >
                All
              </Button>
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorClick(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all flex-shrink-0 ${
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

          {/* Select All (in selection mode) */}
          {isSelectionMode && (
            <div className="px-6 pb-4">
              <div
                className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer"
                onClick={() => setSelectAll(!selectAll)}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded border border-border">
                  {selectAll && <Check className="h-4 w-4" />}
                </div>
                <span className="font-medium">Select All Notes</span>
              </div>
            </div>
          )}

          {/* Add Task Input */}
          {!isSelectionMode && (
            <div className="px-6 pb-6">
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Type something..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
                  className="border-none bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 px-0"
                />
              </div>
            </div>
          )}

          {/* Content Area - Show Notes as Simple List Items */}
          <div className="px-6 pb-20">
            {filteredNotes.length > 0 ? (
              <div className="space-y-6">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`flex items-center justify-between cursor-pointer ${
                      isSelectionMode ? '' : 'py-1'
                    }`}
                    onClick={() => {
                      if (isSelectionMode) {
                        toggleNoteSelection(note.id)
                      } else {
                        router.push(`/notes/${note.id}`)
                      }
                    }}
                    onTouchStart={() => handleLongPressStart(note.id)}
                    onTouchEnd={handleLongPressEnd}
                    onMouseDown={() => handleLongPressStart(note.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                  >
                    <div className="flex items-center gap-4">
                      {isSelectionMode ? (
                        <div className="flex items-center justify-center w-5 h-5 rounded border border-border">
                          {selectedNotes.has(note.id) && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                      ) : (
                        <div className="w-5 h-5" /> // Spacer for consistent alignment
                      )}
                      <span className="text-lg text-foreground">
                        {note.title || 'Untitled'}
                      </span>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          note.color === '#ffffff'
                            ? 'var(--border)'
                            : note.color,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="space-y-6">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-5 w-5 border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span
                        className={`text-lg ${
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
            <Link href="/notes/new">
              <div className="fixed bottom-6 right-6 z-50">
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg"
                >
                  <Plus className="h-6 w-6 text-white" />
                </Button>
              </div>
            </Link>
          )}

          {/* Selection Mode Action Buttons */}
          {isSelectionMode && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={cancelSelection}
                className="bg-background shadow-lg text-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkColorPicker(!showBulkColorPicker)}
                className="bg-background shadow-lg text-sm"
              >
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </Button>

              <Button
                size="sm"
                onClick={deleteSelectedNotes}
                disabled={selectedNotes.size === 0}
                className="bg-red-500 hover:bg-red-600 shadow-lg text-sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedNotes.size})
              </Button>
            </div>
          )}

          {/* Bulk Color Picker */}
          {showBulkColorPicker && (
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-card p-3 rounded-xl shadow-lg border border-border">
              <div className="flex gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    className="w-8 h-8 rounded-full border-2 border-border"
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

  // Desktop Layout
  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            {isSelectionMode
              ? `${selectedNotes.size} selected`
              : 'Notes Dashboard'}
          </h1>
          <div className="flex items-center gap-2">
            {isSelectionMode ? (
              <Button
                variant="outline"
                onClick={cancelSelection}
                className="h-10"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={startSelectionMode}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Palette className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Grid3X3 className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Select All (in selection mode) */}
        {isSelectionMode && (
          <div className="mb-6">
            <div
              className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-sm cursor-pointer w-fit"
              onClick={() => setSelectAll(!selectAll)}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded border border-border">
                {selectAll && <Check className="h-4 w-4" />}
              </div>
              <span className="font-medium">Select All Notes</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Task Manager */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Quick Tasks
              </h2>

              {/* Color Filter */}
              <div className="flex items-center gap-3 p-3 border border-border rounded-2xl mb-6 overflow-x-auto scrollbar-hide">
                <Button
                  variant={selectedColor === null ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedColor(null)}
                  className="whitespace-nowrap flex-shrink-0 text-sm h-8 px-4"
                >
                  All
                </Button>
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorClick(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex-shrink-0 ${
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

              {/* Add Task Input */}
              {!isSelectionMode && (
                <div className="flex items-center gap-3 mb-6">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Type something..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
                    className="border-none bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 px-0"
                  />
                </div>
              )}

              {/* Tasks List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-5 w-5 border-2 border-border"
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
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                  </div>
                ))}
              </div>

              {filteredTasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {selectedColor
                      ? 'No tasks with this color'
                      : 'Start adding your tasks!'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Notes Grid */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-foreground mb-6">
                All Notes
              </h2>

              {filteredNotes.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      viewMode="grid"
                      isSelectionMode={isSelectionMode}
                      isSelected={selectedNotes.has(note.id)}
                      onToggleSelection={toggleNoteSelection}
                      onLongPressStart={() => handleLongPressStart(note.id)}
                      onLongPressEnd={handleLongPressEnd}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Button (only when not in selection mode) */}
        {!isSelectionMode && (
          <Link href="/notes/new">
            <div className="fixed bottom-8 right-8 z-50">
              <Button
                size="lg"
                className="h-16 w-16 rounded-full bg-orange-500 hover:bg-orange-600 shadow-xl"
              >
                <Plus className="h-8 w-8 text-white" />
              </Button>
            </div>
          </Link>
        )}

        {/* Selection Mode Action Buttons */}
        {isSelectionMode && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={cancelSelection}
              className="bg-background shadow-lg px-6"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowBulkColorPicker(!showBulkColorPicker)}
              className="bg-background shadow-lg px-6"
            >
              <Palette className="h-5 w-5 mr-2" />
              Appearance
            </Button>

            <Button
              size="lg"
              onClick={deleteSelectedNotes}
              disabled={selectedNotes.size === 0}
              className="bg-red-500 hover:bg-red-600 shadow-lg px-6"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete ({selectedNotes.size})
            </Button>
          </div>
        )}

        {/* Bulk Color Picker */}
        {showBulkColorPicker && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-card p-4 rounded-xl shadow-lg border border-border">
            <div className="flex gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  className="w-8 h-8 rounded-full border-2 border-border"
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
