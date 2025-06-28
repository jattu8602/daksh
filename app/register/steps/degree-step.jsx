"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function DegreeStep({ formData, updateFormData }) {
  const degrees = ["Bachelor's", "Master's", "Doctoral/PHD", "Associate's", "Certificate/Diploma", "Other"]

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Select your degree
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
        Select the degree program {"you're"} currently enrolled in.
      </p>

      <div className="flex-1">
        {degrees.map((d) => (
          <Card
            key={d}
            className={`mb-3 relative cursor-pointer transition-colors ${
              formData.degree === d
                ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => updateFormData('degree', d)}
          >
            <CardContent className="px-4 py-0.5 flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                {d}
              </span>
              {formData.degree === d && (
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
