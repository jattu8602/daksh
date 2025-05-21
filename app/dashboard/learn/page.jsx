import Image from "next/image"

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome section */}
      <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="font-bold text-lg">Welcome back, Gor!</h2>
          <p className="text-sm text-gray-600">
            You've learned 67% of your goal for this week. Click to view Statistics.
          </p>
        </div>
        <div className="bg-yellow-100 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-500"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>
      </div>

      {/* Achievement notification */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="font-bold">New Achievement</h2>
        <p className="text-sm text-gray-600">You are better than 95% of your batch in Physics</p>
        <div className="flex mt-2">
          <div className="w-2 h-2 bg-black rounded-full mx-1"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full mx-1"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full mx-1"></div>
        </div>
      </div>

      {/* Subject categories */}
      <div className="grid grid-cols-4 gap-3">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 p-3 rounded-full mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m16.24 7.76-4.24 4.24-4.24-4.24" />
              <path d="m16.24 16.24-4.24-4.24-4.24 4.24" />
            </svg>
          </div>
          <span className="text-xs">Math</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 p-3 rounded-full mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2" />
              <path d="M10 12h4" />
            </svg>
          </div>
          <span className="text-xs">Science</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 p-3 rounded-full mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <span className="text-xs">Grammar</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 p-3 rounded-full mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <path d="M6 12a6 6 0 0 1 12 0" />
              <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12" />
            </svg>
          </div>
          <span className="text-xs">Music</span>
        </div>
      </div>

      {/* Points section */}
      <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div>
          <h3 className="font-bold">300 Points</h3>
          <p className="text-sm text-gray-600">Cross 500 within the week to get a free One-on-One Class.</p>
        </div>
        <button className="bg-black text-white text-sm py-2 px-4 rounded-md">Take Test</button>
      </div>

      {/* Trending courses */}
      <div>
        <h3 className="font-bold mb-3">Trending Courses</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=120&width=180"
              alt="Course thumbnail"
              width={180}
              height={120}
              className="w-full h-24 object-cover"
            />
            <div className="p-2">
              <p className="text-xs font-medium">Et malesuada blandit sed fringilla eget pulvinar. Augue.</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>4.5 stars</span>
                <span className="mx-1">|</span>
                <span>Editor's</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=120&width=180"
              alt="Course thumbnail"
              width={180}
              height={120}
              className="w-full h-24 object-cover"
            />
            <div className="p-2">
              <p className="text-xs font-medium">Est cursatur vit Adipiscing facilis</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>4.9 stars</span>
                <span className="mx-1">|</span>
                <span>Editor's</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Study suggestions */}
      <div>
        <h3 className="font-bold mb-3">What would you like to study today?</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center">
              <span className="font-serif text-lg mr-2">Aa</span>
              <div>
                <p className="font-medium text-sm">Verbal ability</p>
                <p className="text-xs text-gray-500">5 topics</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
              <div>
                <p className="font-medium text-sm">Data interpretation</p>
                <p className="text-xs text-gray-500">12 topics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended learning methods */}
      <div>
        <h3 className="font-bold mb-3">Recommended</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border">
            <Image
              src="/placeholder.svg?height=100&width=150"
              alt="Listen and Learn"
              width={150}
              height={100}
              className="w-full h-24 object-contain mb-2"
            />
            <p className="font-medium text-sm">Listen and Learn</p>
            <p className="text-xs text-gray-500">10 lessons</p>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <Image
              src="/placeholder.svg?height=100&width=150"
              alt="Puzzle Games"
              width={150}
              height={100}
              className="w-full h-24 object-contain mb-2"
            />
            <p className="font-medium text-sm">Puzzle Games</p>
            <p className="text-xs text-gray-500">8 games</p>
          </div>
        </div>
      </div>
    </div>
  )
}
