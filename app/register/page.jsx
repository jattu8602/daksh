"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import GenderStep from "./steps/gender-step"
import NameStep from "./steps/name-step"
import AgeStep from "./steps/age-step"
import PurposeStep from "./steps/purpose-step"
import EducationStep from "./steps/education-step"
import SchoolStep from "./steps/school-step"
import UniversityStep from "./steps/university-step"
import ClassStep from "./steps/class-step"
import DegreeStep from "./steps/degree-step"
import YearStep from "./steps/year-step"
import ReminderStep from "./steps/reminder-step"
import DiscoveryStep from "./steps/discovery-step"

const getStepsForEducation = (education) => {
  const baseSteps = ["gender", "name", "age", "purpose", "education"]

  if (education === "School") {
    return [...baseSteps, "school", "class", "reminder", "discovery"]
  } else if (education === "College/University") {
    return [...baseSteps, "university", "degree", "year", "reminder", "discovery"]
  } else {
    return [...baseSteps, "reminder", "discovery"]
  }
}

export default function StudentRegistration() {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(["gender", "name", "age", "purpose", "education", "reminder", "discovery"])
  const [formData, setFormData] = useState({
    gender: "",
    name: "",
    age: 13,
    purpose: "",
    education: "",
    school: "",
    university: "",
    class: "",
    degree: "",
    year: "",
    reminderHour: 13,
    reminderMinute: 13,
    reminderPeriod: "PM",
    discovery: "",
  })

  const updateFormData = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Update steps when education level changes
      if (field === "education") {
        const newSteps = getStepsForEducation(value)
        setSteps(newSteps)
      }

      return newData
    })
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    console.log("Registration completed:", formData)
    alert("Registration completed successfully!")
  }

  const renderProgressBar = () => {
    if (currentStep === 0) return null

    const progress = ((currentStep + 1) / steps.length) * 100

    return (
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div
            className="bg-black dark:bg-white h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {currentStep + 1}/{steps.length}
        </span>
      </div>
    )
  }

  const renderStep = () => {
    switch (steps[currentStep]) {
      case "gender":
        return <GenderStep formData={formData} updateFormData={updateFormData} />
      case "name":
        return <NameStep formData={formData} updateFormData={updateFormData} />
      case "age":
        return <AgeStep formData={formData} updateFormData={updateFormData} />
      case "purpose":
        return <PurposeStep formData={formData} updateFormData={updateFormData} />
      case "education":
        return <EducationStep formData={formData} updateFormData={updateFormData} />
      case "school":
        return <SchoolStep formData={formData} updateFormData={updateFormData} />
      case "university":
        return <UniversityStep formData={formData} updateFormData={updateFormData} />
      case "class":
        return <ClassStep formData={formData} updateFormData={updateFormData} />
      case "degree":
        return <DegreeStep formData={formData} updateFormData={updateFormData} />
      case "year":
        return <YearStep formData={formData} updateFormData={updateFormData} />
      case "reminder":
        return <ReminderStep formData={formData} updateFormData={updateFormData} />
      case "discovery":
        return <DiscoveryStep formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-sm mx-auto px-6 py-8 flex flex-col min-h-screen">
        {/* Header with back button */}
        {currentStep > 0 && (
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={prevStep} className="p-0 h-auto">
              <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
        )}

        {/* Progress bar */}
        {renderProgressBar()}

        {/* Step content */}
        <div className="flex-1">{renderStep()}</div>

        {/* Continue/Finish button */}
        <div className="mt-auto mb-6">
          <Button
            onClick={currentStep === steps.length - 1 ? handleFinish : nextStep}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl text-lg font-medium transition-colors"
            disabled={!isStepValid()}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )

  function isStepValid() {
    switch (steps[currentStep]) {
      case "gender":
        return formData.gender !== ""
      case "name":
        return formData.name.trim() !== ""
      case "age":
        return formData.age !== ""
      case "purpose":
        return formData.purpose !== ""
      case "education":
        return formData.education !== ""
      case "school":
        return formData.school !== ""
      case "university":
        return formData.university !== ""
      case "class":
        return formData.class !== ""
      case "degree":
        return formData.degree !== ""
      case "year":
        return formData.year !== ""
      case "reminder":
        return true
      case "discovery":
        return formData.discovery !== ""
      default:
        return false
    }
  }
}
