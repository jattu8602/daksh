'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Check } from 'lucide-react'

export default function UniversityStep({ formData, updateFormData }) {
  const universities = [
    'Harvard University',
    'Stanford University',
    'Massachusetts Institute of Technology',
    'NMIT',
    'Yale University',
  ]

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Select your university
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
        Choose the college/university you are in.
      </p>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 py-3 bg-gray-50 dark:bg-gray-800 border-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-white dark:focus:ring-0 dark:focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1">
        {universities.map((u) => (
          <Card
            key={u}
            className={`mb-3 !p-4 relative cursor-pointer transition-colors ${
              formData.university === u
                ? 'border-black dark:border-white bg-gray-50 dark:bg-transparent'
                : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800'
            }`}
            onClick={() => updateFormData('university', u)}
          >
            <CardContent className="px-4 py-0.5 flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white dear">
                {u}
              </span>
              {formData.university === u && (
                <div className="w-6 h-6 bg-transparent flex items-center justify-center">
                  <Check className="w-6 h-6 font-semibold dark:text-white text-black" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
