'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function YearStep({ formData, updateFormData }) {
  const years = [
    'Freshman',
    'Sophomore',
    'Junior',
    'Senior',
    'Graduate',
    'Other',
  ]

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        What year are you in ?
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
        Let us know your current year of study.
      </p>

      <div className="flex-1">
        {years.map((y) => (
          <Card
            key={y}
            className={`mb-3 relative cursor-pointer transition-colors ${
              formData.year === y
                ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => updateFormData('year', y)}
          >
            <CardContent className="px-4 py-0.5 flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                {y}
              </span>
              {formData.year === y && (
                <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white dark:text-black" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
