'use client'
import { useRef, useEffect } from 'react'

export default function AgeStep({ formData, updateFormData }) {
  const containerRef = useRef(null)
  const ages = Array.from({ length: 30 }, (_, i) => i + 10) // 10-39 yrs

  // Constants matching CSS (Tailwind):
  const ITEM_HEIGHT = 48 // px
  const CONTAINER_HEIGHT = 240 // px (h-60)
  const PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2 // px (h-24)

  // Snap to the chosen age whenever age changes externally
  useEffect(() => {
    const idx = ages.indexOf(formData.age)
    if (idx !== -1 && containerRef.current) {
      containerRef.current.scrollTo({
        top: idx * ITEM_HEIGHT,
        behavior: 'smooth',
      })
    }
  }, [formData.age])

  const onScroll = () => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const nearestIndex = Math.round(scrollTop / ITEM_HEIGHT)
    const newAge = ages[nearestIndex]
    if (newAge !== formData.age && newAge) {
      updateFormData('age', newAge)
    }
  }

  return (
    <div className="text-center flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        How old are you?
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-16">
        This helps us tailor your study plans.
      </p>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative h-60 w-24 overflow-hidden">
          {/* Highlight bar */}
          <div className="absolute inset-x-0 top-1/2 h-12 -translate-y-1/2 bg-primary/10 border-2 border-primary/20 rounded-xl z-10 pointer-events-none" />

          {/* Scrollable list */}
          <div
            ref={containerRef}
            onScroll={onScroll}
            className="h-full overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingTop: `${PADDING}px`,
              paddingBottom: `${PADDING}px`,
            }}
          >
            {ages.map((age) => (
              <div
                key={age}
                className={`h-12 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 ${
                  formData.age === age
                    ? 'text-2xl font-bold text-black dark:text-white'
                    : 'text-lg text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
                }`}
                onClick={() => updateFormData('age', age)}
              >
                {age}
              </div>
            ))}
          </div>
        </div>
        <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
          years
        </span>
      </div>
    </div>
  )
}
