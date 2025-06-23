'use client'

import { Button } from '@/components/ui/button'

export function ColorFilter({
  colors,
  selectedColor,
  onColorSelect,
  isSelectionMode = false,
}) {
  return (
    <div className="mb-4 md:mb-6">
      <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-1">
        {!isSelectionMode && (
          <Button
            variant={selectedColor === null ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onColorSelect(null)}
            className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm h-8 md:h-9 px-3 md:px-4"
          >
            All
          </Button>
        )}

        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() =>
              onColorSelect(selectedColor === color.value ? null : color.value)
            }
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all flex-shrink-0 relative ${
              selectedColor === color.value && !isSelectionMode
                ? 'border-gray-900 dark:border-white scale-110'
                : 'border-gray-300 dark:border-gray-600'
            } ${
              isSelectionMode ? 'hover:scale-110 hover:border-blue-500' : ''
            }`}
            style={{
              backgroundColor: color.value,
              borderColor:
                color.border ||
                (selectedColor === color.value && !isSelectionMode
                  ? undefined
                  : color.border),
            }}
            title={
              isSelectionMode
                ? `Select all ${color.name} notes`
                : `Filter by ${color.name}`
            }
          >
            {isSelectionMode && (
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-xs text-white font-bold">+</span>
              </div>
            )}
          </button>
        ))}

        {isSelectionMode && (
          <div className="ml-2 md:ml-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
            Click colors to select all notes of that color
          </div>
        )}
      </div>
    </div>
  )
}
