'use client'
import { Input } from '@/components/ui/input'

export default function NameStep({ formData, updateFormData }) {
  return (
    <div className="text-center flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {"What's your name ?"}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-16">
        {"We'd love to know what to call you."}
      </p>

      <div className="flex-1 flex items-center">
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          className="text-center text-xl py-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none ring-0 focus:outline-none !focus:ring-0 focus:border-none active:outline-none active:ring-0 active:border-none text-gray-900 dark:text-white"
          placeholder="Enter your name"
        />
      </div>
    </div>
  )
}
