'use client'
import { useRef, useEffect, forwardRef } from 'react'

// Constants
const ITEM_HEIGHT = 40 // px
const CONTAINER_HEIGHT = 192 // px (h-48)
const PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2 // px

export default function ReminderStep({ formData, updateFormData }) {
  const hourRef = useRef(null)
  const minRef = useRef(null)

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  // Snap on mount
  useEffect(() => {
    const snapTo = (ref, list, value) => {
      const idx = list.indexOf(value)
      if (idx !== -1 && ref.current) {
        ref.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'auto' })
      }
    }
    snapTo(hourRef, hours, formData.reminderHour)
    snapTo(minRef, minutes, formData.reminderMinute)
  }, [formData.reminderHour, formData.reminderMinute])

  return (
    <div className="text-center flex flex-col h-full">
      <h1 className="text-3xl text-center font-bold mb-4 text-gray-900 dark:text-white">
        Set your study reminder
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-16">
        Choose a time for your daily study reminder.
      </p>

      <div className="flex-1 flex items-center justify-center space-x-8">
        <Dial
          ref={hourRef}
          list={hours}
          value={formData.reminderHour}
          onSnap={(v) => updateFormData('reminderHour', v)}
        />
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          :
        </span>
        <Dial
          ref={minRef}
          list={minutes}
          value={formData.reminderMinute}
          onSnap={(v) => updateFormData('reminderMinute', v)}
          pad={2}
        />
        <div className="flex flex-col space-y-3">
          {['AM', 'PM'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => updateFormData('reminderPeriod', p)}
              className={`px-3 py-2 rounded-lg transition-all duration-150 focus:outline-none ${
                formData.reminderPeriod === p
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                  : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-10 text-gray-400 dark:text-gray-500 text-sm">
        You can always change this later.
      </p>
    </div>
  )
}

const Dial = forwardRef(function Dial({ list, value, onSnap, pad = 1 }, ref) {
  if (!ref) return null

  const handleScroll = () => {
    if (!ref.current) return
    clearTimeout(ref.current._snapTimeout)
    ref.current._snapTimeout = setTimeout(() => {
      if (!ref.current) return
      const nearest = Math.round(ref.current.scrollTop / ITEM_HEIGHT)
      const selected = list[nearest]
      if (selected !== value && selected !== undefined) {
        onSnap(selected)
        ref.current.scrollTo({ top: nearest * ITEM_HEIGHT, behavior: 'smooth' })
      }
    }, 50)
  }

  const choose = (v) => {
    onSnap(v)
    const idx = list.indexOf(v)
    if (ref.current)
      ref.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' })
  }

  return (
    <div className="relative h-48 w-16 overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 bg-transparent border-2 border-t-black border-b-black dark:border-b-white dark:border-t-white  z-10 pointer-events-none" />
      <div
        ref={ref}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory"
        style={{
          paddingTop: `${PADDING}px`,
          paddingBottom: `${PADDING}px`,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          ::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {list.map((n) => (
          <div
            key={n}
            onClick={() => choose(n)}
            className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-transform duration-150 ${
              value === n
                ? 'scale-110 font-bold text-black dark:text-white'
                : 'text-base text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
            }`}
          >
            {n.toString().padStart(pad, '0')}
          </div>
        ))}
      </div>
    </div>
  )
})
