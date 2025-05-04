"use client";

import { useState } from "react";

export default function ReelsPage() {
  const [activeReel, setActiveReel] = useState(0);

  const reels = [
    {
      id: 1,
      author: "Ms. Johnson",
      subject: "Mathematics",
      title: "Understanding Quadratic Equations",
      likes: 156,
      comments: 24,
      description: "Learn how to solve quadratic equations step-by-step with this quick tutorial!"
    },
    {
      id: 2,
      author: "Dr. Williams",
      subject: "Science",
      title: "Chemical Reactions in Everyday Life",
      likes: 243,
      comments: 38,
      description: "Did you know these common household items create chemical reactions? Watch now!"
    },
    {
      id: 3,
      author: "Mr. Davis",
      subject: "History",
      title: "Ancient Civilizations: Egypt",
      likes: 187,
      comments: 29,
      description: "Explore the fascinating history and achievements of ancient Egypt."
    },
  ];

  const handleNext = () => {
    setActiveReel((prev) => (prev === reels.length - 1 ? 0 : prev + 1));
  };

  const handlePrevious = () => {
    setActiveReel((prev) => (prev === 0 ? reels.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-4 py-3 border-b">
        <h1 className="text-xl font-bold">Reels</h1>
      </div>

      <div className="flex-1 relative overflow-hidden bg-black">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${
              index === activeReel ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Placeholder for video */}
            <div className="flex-1 flex items-center justify-center text-white text-lg">
              <div className="text-center p-4">
                <div className="text-6xl mb-4">🎬</div>
                <p className="font-bold">{reel.title}</p>
                <p className="text-sm text-gray-300 mt-2">{reel.description}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
              <button className="bg-white/20 rounded-full h-10 w-10 flex items-center justify-center">
                <span className="text-white text-xl">❤️</span>
              </button>
              <div className="text-white text-xs">{reel.likes}</div>

              <button className="bg-white/20 rounded-full h-10 w-10 flex items-center justify-center">
                <span className="text-white text-xl">💬</span>
              </button>
              <div className="text-white text-xs">{reel.comments}</div>

              <button className="bg-white/20 rounded-full h-10 w-10 flex items-center justify-center">
                <span className="text-white text-xl">⏩</span>
              </button>
            </div>

            {/* Author info */}
            <div className="absolute left-4 bottom-24 text-white">
              <div className="font-bold">{reel.author}</div>
              <div className="text-sm text-gray-300">{reel.subject}</div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full h-10 w-10 flex items-center justify-center"
            >
              <span className="text-white">←</span>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full h-10 w-10 flex items-center justify-center"
            >
              <span className="text-white">→</span>
            </button>
          </div>
        ))}

        {/* Progress indicator */}
        <div className="absolute top-4 left-0 right-0 flex justify-center space-x-1">
          {reels.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-6 rounded-full ${
                index === activeReel ? "bg-white" : "bg-white/30"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}