'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const TASK_COLORS = [
  '#06b6d4', // cyan
  '#f97316', // orange
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // violet
]

export function TaskList({ tasks, onTasksChange, selectedColor }) {
  const [newTaskText, setNewTaskText] = useState('')

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        color: TASK_COLORS[tasks.length % TASK_COLORS.length],
      }
      onTasksChange([...tasks, newTask])
      setNewTaskText('')
    }
  }

  const toggleTask = (taskId) => {
    onTasksChange(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (taskId) => {
    onTasksChange(tasks.filter((task) => task.id !== taskId))
  }

  const updateTaskText = (taskId, text) => {
    onTasksChange(
      tasks.map((task) => (task.id === taskId ? { ...task, text } : task))
    )
  }

  return (
    <div className="space-y-4">
      {/* Add Task Input */}
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Type something..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="border-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground"
        />
      </div>

      {/* Task List */}
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-3 group">
          <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
            <div
              className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
              style={{
                backgroundColor: task.completed ? task.color : 'transparent',
                borderColor: task.color,
              }}
            >
              {task.completed && (
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              )}
            </div>
          </button>

          <Input
            value={task.text}
            onChange={(e) => updateTaskText(task.id, e.target.value)}
            className={`flex-1 border-none px-0 focus-visible:ring-0 bg-transparent ${
              task.completed ? 'line-through text-muted-foreground' : ''
            }`}
          />

          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: task.color }}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTask(task.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}
