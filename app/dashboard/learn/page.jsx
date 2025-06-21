'use client'

import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'

const subjects = [
  {
    name: 'Biology',
    icon: 'https://res.cloudinary.com/doxmvuss9/image/upload/v1750488134/link-generator/b2geavirntujsh92ryrd.png',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    name: 'Chemistry',
    icon: 'https://res.cloudinary.com/doxmvuss9/image/upload/v1750481749/link-generator/knewmnabdmlioyqpf4ag.png',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    name: 'English',
    icon: 'https://res.cloudinary.com/doxmvuss9/image/upload/v1750481747/link-generator/ujlnotnl48vqytxapwtq.png',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    name: 'Maths',
    icon: 'https://res.cloudinary.com/doxmvuss9/image/upload/v1750481750/link-generator/cntvevx2fgfpyx921fc8.png',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    name: 'Physics',
    icon: 'https://res.cloudinary.com/doxmvuss9/image/upload/v1750481745/link-generator/j7spa5jknlbv5jstal3p.png',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    name: 'History',
    icon: 'https://res.cloudinary.com/doxmvuss9/image/upload/v1750481748/link-generator/blwpbd1adiubumbjtmvl.png',
    bgColor: 'bg-pink-100 dark:bg-yellow-900/30',
  },
]

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="px-4 space-y-8">
        {/* Illustration */}
        <div className="bg-linear-to-b from-cyan-950/20 to-transparent rounded-md !py-0 dark:bg-cyan-950/5">
          <div className="relative z-10 flex flex-col justify-center h-full p-6">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 leading-tight mb-2">
              Experience our self-study
              <br />
              course content
            </h2>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <span className="mr-2">Explore below</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
          <div className="px-5 relative">
            <div
              className="relative h-64 bg-contain bg-no-repeat bg-center rounded-2xl overflow-hidden -mx-4 p-1 m-1"
              style={{
                backgroundImage: `url('https://res.cloudinary.com/doxmvuss9/image/upload/v1750496225/link-generator/qwzvl59ms9jxudexeggh.png')`,
              }}
            >
              {/* Free Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="inline-flex items-center bg-green-500/90 dark:bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium transition-all duration-500 hover:bg-green-600 dark:hover:bg-green-700 cursor-pointer shadow-lg hover:shadow-green-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  FREE
                  <Sparkles className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="space-y-4 animate-slide-up-delay">
          <div className="flex items-center justify-between">
            <div className="flex flex-col flex-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Free revision material
              </h3>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                for Class 10
              </h3>
            </div>
            <Select defaultValue="ncert">
              <SelectTrigger className="w-32 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ncert">NCERT</SelectItem>
                <SelectItem value="cbse">CBSE</SelectItem>
                <SelectItem value="icse">ICSE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-3 gap-3">
            {subjects.map((subject, index) => {
              const [imgError, setImgError] = useState(false)

              return (
                <Card
                  key={index}
                  className={`${subject.bgColor} border-none shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 hover:-translate-y-1 animate-card-appear !p-1`}
                  style={{ animationDelay: `${index * 50}ms` }} // faster animation delay
                >
                  <CardContent className="p-2">
                    <div className="relative h-22 w-full">
                      <h4 className="absolute top-0 left-0 font-medium text-gray-900 dark:text-white text-sm leading-tight">
                        {subject.name}
                      </h4>

                      {/* Subject icon */}
                      <div className="absolute bottom-1 right-1 w-12 h-12 flex items-end justify-end transition-transform duration-300 hover:rotate-12">
                        {imgError ? (
                          getSubjectEmoji(subject.name)
                        ) : (
                          <Image
                            src={subject.icon}
                            alt={subject.name}
                            width={48}
                            height={48}
                            className="object-contain"
                            onError={() => setImgError(true)}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes card-appear {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up-delay {
          animation: slide-up 0.4s ease-out 0.2s both;
        }

        .animate-card-appear {
          animation: card-appear 0.3s ease-out both;
        }
      `}</style>
    </div>
  )
}

function getSubjectEmoji(subjectName) {
  const emojiMap = {
    Biology: '🌱',
    Chemistry: '⚗️',
    English: '📚',
    Maths: '📐',
    Physics: '🔺',
    History: '🏺',
  }
  return emojiMap[subjectName] || '📖'
}
