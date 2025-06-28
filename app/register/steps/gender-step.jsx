"use client"

export default function GenderStep({ formData, updateFormData }) {
  return (
    <div className="text-center flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-20 text-gray-900 dark:text-white">{"What's your Gender?"}</h1>

      <div className="flex-1 flex flex-col justify-center space-y-12">
        {/* Male */}
        <div
          className={`relative cursor-pointer transition-opacity ${
            formData.gender === "male" ? "opacity-100" : "opacity-60"
          }`}
          onClick={() => updateFormData("gender", "male")}
        >
          <div
            className={`w-32 h-32 mx-auto rounded-full border-2 flex items-center justify-center mb-4 transition-colors ${
              formData.gender === "male"
                ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800"
                : "border-gray-200 dark:border-gray-600"
            }`}
          >
            <div className="text-4xl">♂</div>
          </div>
          <p className="text-xl font-medium text-gray-900 dark:text-white">Male</p>
        </div>

        {/* Female */}
        <div
          className={`relative cursor-pointer transition-opacity ${
            formData.gender === "female" ? "opacity-100" : "opacity-60"
          }`}
          onClick={() => updateFormData("gender", "female")}
        >
          <div
            className={`w-32 h-32 mx-auto rounded-full border-2 flex items-center justify-center mb-4 transition-colors ${
              formData.gender === "female"
                ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800"
                : "border-gray-200 dark:border-gray-600"
            }`}
          >
            <div className="text-4xl">♀</div>
          </div>
          <p className="text-xl font-medium text-gray-900 dark:text-white">Female</p>
        </div>
      </div>
    </div>
  )
}
