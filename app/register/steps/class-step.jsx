"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function ClassStep({ formData, updateFormData }) {
  const classes = ["6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"]

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Select your class
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
        Select the class you are currently in.
      </p>

      <div className="flex-1">
        {classes.map((c) => (
          <Card
            key={c}
            className={`mb-3 relative cursor-pointer transition-colors ${
              formData.class === c
                ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => updateFormData('class', c)}
          >
            <CardContent className="px-4 py-0.5 flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                {c}
              </span>
              {formData.class === c && (
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
