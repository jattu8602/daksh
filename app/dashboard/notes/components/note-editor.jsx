'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  CheckSquare,
  Square,
  Palette,
} from 'lucide-react'

const COLORS = [
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#dbeafe', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
]

export function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tasks, setTasks] = useState(note.tasks)
  const [color, setColor] = useState(note.color)
  const [newTaskText, setNewTaskText] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const titleRef = useRef(null)

  useEffect(() => {
    if (titleRef.current && !note.title) {
      titleRef.current.focus()
    }
  }, [note.title])

  const handleSave = () => {
    const updatedNote = {
      ...note,
      title: title.trim() || 'Untitled',
      content: content.trim(),
      tasks,
      color,
      updatedAt: new Date(),
    }
    onSave(updatedNote)
  }

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
      }
      setTasks([...tasks, newTask])
      setNewTaskText('')
    }
  }

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const updateTaskText = (taskId, text) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, text } : task))
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Palette className="h-4 w-4" />
              </Button>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-full left-0 mt-2 p-2 bg-popover border rounded-lg shadow-lg z-10"
                >
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          color === c
                            ? 'border-foreground scale-110'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={() => {
                          setColor(c)
                          setShowColorPicker(false)
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div>
            <Input
              ref={titleRef}
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-none px-0 focus-visible:ring-0"
            />
          </div>

          <div>
            <Textarea
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] border-none px-0 focus-visible:ring-0 resize-none"
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </h4>

            <div className="flex gap-2">
              <Input
                placeholder="Add a task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-1"
              />
              <Button onClick={addTask} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 group"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <Input
                    value={task.text}
                    onChange={(e) => updateTaskText(task.id, e.target.value)}
                    className={`flex-1 border-none px-0 focus-visible:ring-0 ${
                      task.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
