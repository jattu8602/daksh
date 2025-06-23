'use client'

import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'

export function NoteCard({
  note,
  viewMode = 'masonry',
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
}) {
  const completedTasks = note.tasks.filter((task) => task.completed).length
  const totalTasks = note.tasks.length

  const handleCardClick = (e) => {
    if (isSelectionMode) {
      e.preventDefault()
      onToggleSelection?.(note.id)
    }
  }

  const handleCheckboxClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleSelection?.(note.id)
  }

  const CardContent = (
    <div
      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={handleCardClick}
    >
      <div
        className="rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-3 md:mb-4 relative h-64 md:h-80 flex flex-col"
        style={{ backgroundColor: note.color }}
      >
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection?.(note.id)}
              onClick={handleCheckboxClick}
              className="bg-white border-2 border-gray-300 h-4 w-4 md:h-5 md:w-5"
            />
          </div>
        )}

        {/* Header */}
        <div
          className={`flex items-start justify-between mb-3 md:mb-4 ${
            isSelectionMode ? 'ml-6 md:ml-8' : ''
          }`}
        >
          <h3 className="font-semibold text-base md:text-lg text-gray-900 dark:text-white line-clamp-2 flex-1 pr-2">
            {note.title || 'Untitled'}
          </h3>
          {!isSelectionMode && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 md:h-8 md:w-8 text-gray-600 dark:text-gray-400 flex-shrink-0"
              onClick={(e) => e.preventDefault()}
            >
              <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {note.content && (
            <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm mb-3 md:mb-4 line-clamp-3 md:line-clamp-4">
              {note.content}
            </p>
          )}

          {/* Tasks */}
          {note.tasks.length > 0 && (
            <div className="space-y-1 md:space-y-2 overflow-hidden">
              {note.tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 text-xs md:text-sm"
                >
                  <div
                    className="w-3 h-3 md:w-4 md:h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: task.completed
                        ? task.color
                        : 'transparent',
                      borderColor: task.color,
                    }}
                  >
                    {task.completed && (
                      <div className="w-1 h-1 md:w-2 md:h-2 bg-white rounded-sm"></div>
                    )}
                  </div>
                  <span
                    className={`truncate ${
                      task.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
              ))}
              {note.tasks.length > 3 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  +{note.tasks.length - 3} more tasks
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 md:mt-4 pt-2 border-t border-gray-200 dark:border-gray-600 border-opacity-30">
          <div className="flex items-center gap-1 md:gap-2">
            <div
              className="w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: note.color }}
            />
            {totalTasks > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {completedTasks}/{totalTasks}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {note.updatedAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )

  if (isSelectionMode) {
    return CardContent
  }

  return <Link href={`/dashboard/notes/${note.id}`}>{CardContent}</Link>
}
