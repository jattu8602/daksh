'use client'

import { motion } from 'framer-motion'
import { Check, Square } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export function NoteCard({
  note,
  viewMode = 'grid',
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
  onLongPressStart,
  onLongPressEnd,
}) {
  // Ensure tasks is always an array
  const tasks = note.tasks || []

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative overflow-hidden rounded-xl border transition-all',
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
      onMouseDown={onLongPressStart}
      onMouseUp={onLongPressEnd}
      onMouseLeave={onLongPressEnd}
      onTouchStart={onLongPressStart}
      onTouchEnd={onLongPressEnd}
    >
      <Card
        className={cn(
          'h-full overflow-hidden border-none shadow-none transition-all',
          isSelectionMode ? 'cursor-pointer' : 'cursor-default'
        )}
        style={{
          backgroundColor:
            note.color === '#ffffff' ? 'var(--muted)' : note.color,
        }}
        onClick={() => isSelectionMode && onToggleSelection(note.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle
              className={cn(
                'line-clamp-2 text-lg font-semibold leading-tight',
                note.color === '#ffffff' ? 'text-foreground' : 'text-gray-900'
              )}
            >
              {note.title || 'Untitled'}
            </CardTitle>
            {isSelectionMode && (
              <div className="mt-0.5 flex-shrink-0">
                <Checkbox
                  checked={isSelected}
                  className="h-5 w-5 border-2 border-border data-[state=checked]:border-primary"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' && (
            <div className="space-y-2">
              <p
                className={cn(
                  'line-clamp-3 text-sm',
                  note.color === '#ffffff'
                    ? 'text-muted-foreground'
                    : 'text-gray-700'
                )}
              >
                {note.content}
              </p>
              {totalTasks > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={cn(
                        note.color === '#ffffff'
                          ? 'text-muted-foreground'
                          : 'text-gray-600'
                      )}
                    >
                      Tasks: {completedTasks}/{totalTasks}
                    </span>
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {tasks
                      .filter((task) => !task.completed)
                      .slice(0, 3)
                      .map((task) => (
                        <div key={task.id} className="flex items-center gap-2">
                          <Square className="h-3.5 w-3.5 text-muted-foreground" />
                          <span
                            className={cn(
                              'truncate text-sm',
                              note.color === '#ffffff'
                                ? 'text-muted-foreground'
                                : 'text-gray-700'
                            )}
                          >
                            {task.text}
                          </span>
                        </div>
                      ))}
                    {tasks.filter((task) => !task.completed).length > 3 && (
                      <div
                        className={cn(
                          'text-xs',
                          note.color === '#ffffff'
                            ? 'text-muted-foreground'
                            : 'text-gray-600'
                        )}
                      >
                        +{tasks.filter((task) => !task.completed).length - 3}{' '}
                        more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <div
        className="absolute bottom-3 right-3 h-3 w-3 rounded-full border border-border"
        style={{
          backgroundColor:
            note.color === '#ffffff' ? 'var(--border)' : note.color,
        }}
      />
    </motion.div>
  )
}
