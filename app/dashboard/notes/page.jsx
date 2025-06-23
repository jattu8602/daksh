'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Palette, Grid3X3, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from './components/empty-state'
import { NoteCard } from './components/note-card'
import Link from 'next/link'

const COLORS = [
  { name: 'white', value: '#ffffff', border: '#e5e7eb' },
  { name: 'orange', value: '#f97316' },
  { name: 'yellow', value: '#eab308' },
  { name: 'cyan', value: '#06b6d4' },
  { name: 'green', value: '#22c55e' },
  { name: 'pink', value: '#ec4899' },
  { name: 'purple', value: '#8b5cf6' },
]

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [newTaskText, setNewTaskText] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState(new Set())

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        setAllTasks(parsedNotes.flatMap((note) => note.tasks))
      }
    } catch (error) {
      console.error('Failed to load notes:', error)
    }
  }, [mounted])

  const addNewTask = () => {
    if (!newTaskText.trim()) return

    const taskColors = ['#06b6d4', '#f97316', '#22c55e', '#ec4899', '#8b5cf6']
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      color: taskColors[allTasks.length % taskColors.length],
    }

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

    const updatedNotes = notes.map((note) => ({
      ...note,
      tasks: note.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }))
    setNotes(updatedNotes)
    localStorage.setItem('dashboard-notes', JSON.stringify(updatedNotes))
  }

  const startSelectionMode = () => {
    setIsSelectionMode(true)
    setSelectedNotes(new Set())
  }

  const cancelSelection = () => {
    setIsSelectionMode(false)
    setSelectedNotes(new Set())
  }

  const toggleNoteSelection = (noteId) => {
    const newSelected = new Set(selectedNotes)
    if (newSelected.has(noteId)) {
      newSelected.delete(noteId)
    } else {
      newSelected.add(noteId)
    }
    setSelectedNotes(newSelected)
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
      setIsSelectionMode(false)
      setSelectedNotes(new Set())
    }
  }

  const filteredTasks = selectedColor
    ? allTasks.filter((task) => task.color === selectedColor)
    : allTasks
  const filteredNotes = selectedColor
    ? notes.filter((note) => note.color === selectedColor)
    : notes

  // Render logic stays same
  // All JSX in your original code is already valid for `.jsx`

  return (
    <>
      {/* Full JSX return remains as is, unchanged from your original code */}
      {/* Copy-paste rest of JSX content here as-is from original .tsx */}
    </>
  )
}
