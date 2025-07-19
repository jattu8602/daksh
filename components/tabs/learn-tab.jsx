'use client'

import { useState, useEffect } from 'react'
import {
  ChevronDown,
  Sparkles,
  BookOpen,
  Users,
  Video,
  FileText,
  Sheet,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

export default function LearnTab() {
  const [studentData, setStudentData] = useState(null)
  const [boards, setBoards] = useState([])
  const [subjects, setSubjects] = useState([])
  const [beyondSchoolSubjects, setBeyondSchoolSubjects] = useState([])
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [isLoadingStudent, setIsLoadingStudent] = useState(true)
  const [isLoadingBoards, setIsLoadingBoards] = useState(false)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [error, setError] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoadingStudent(true)
        setError(null)

        // Fetch student session data
        const sessionResponse = await fetch('/api/auth/session', {
          credentials: 'include',
        })

        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch student data')
        }

        const sessionData = await sessionResponse.json()

        if (!sessionData.success || !sessionData.user?.student) {
          throw new Error('Student data not found')
        }

        setStudentData(sessionData.user)

        // Fetch boards for the student's class
        const classId =
          sessionData.user.student.class.parentClassId ||
          sessionData.user.student.class.id

        setIsLoadingBoards(true)
        const boardsResponse = await fetch(`/api/boards?classId=${classId}`)

        if (!boardsResponse.ok) {
          throw new Error('Failed to fetch boards')
        }

        const boardsData = await boardsResponse.json()

        if (boardsData.success) {
          // Filter out any boards with empty or invalid values
          const validBoards = (boardsData.boards || []).filter(
            (board) =>
              board &&
              board.id &&
              board.name &&
              board.id.trim() !== '' &&
              board.name.trim() !== ''
          )
          setBoards(validBoards)
          // Auto-select first board if available
          if (validBoards.length > 0) {
            setSelectedBoard(validBoards[0])
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoadingStudent(false)
        setIsLoadingBoards(false)
      }
    }

    fetchStudentData()
  }, [])

  // Fetch subjects when board is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedBoard) {
        setSubjects([])
        setBeyondSchoolSubjects([])
        return
      }

      try {
        setIsLoadingSubjects(true)
        // Fetch regular subjects
        const subjectsResponse = await fetch(`/api/boards/${selectedBoard.id}`)
        if (subjectsResponse.ok) {
          const subjectsData = await subjectsResponse.json()
          if (subjectsData.success) {
            // Filter out any subjects with empty or invalid values
            const validSubjects = (subjectsData.board.subjects || []).filter(
              (subject) =>
                subject &&
                subject.id &&
                subject.name &&
                subject.id.trim() !== '' &&
                subject.name.trim() !== ''
            )
            const validBeyondSubjects = (
              subjectsData.board.beyondSchoolSubjects || []
            ).filter(
              (subject) =>
                subject &&
                subject.id &&
                subject.name &&
                subject.id.trim() !== '' &&
                subject.name.trim() !== ''
            )
            setSubjects(validSubjects)
            setBeyondSchoolSubjects(validBeyondSubjects)
          }
        }
      } catch (error) {
        console.error('Error fetching subjects:', error)
      } finally {
        setIsLoadingSubjects(false)
      }
    }

    fetchSubjects()
  }, [selectedBoard])

  const getSubjectEmoji = (subjectName) => {
    const emojiMap = {
      Biology: '🌱',
      Chemistry: '🧪',
      Physics: '⚡',
      Mathematics: '📐',
      Math: '📐',
      English: '📚',
      History: '🏛️',
      Geography: '🌍',
      Science: '🔬',
      Computer: '💻',
      Coding: '💻',
      Art: '🎨',
      Music: '🎵',
      Sports: '⚽',
      Dance: '💃',
      Yoga: '🧘',
      Cooking: '👨‍🍳',
      Photography: '📸',
      Gardening: '🌿',
      'Creative Writing': '✍️',
      'Public Speaking': '🎤',
      'Financial Literacy': '💰',
      'Life Skills': '🛠️',
    }
    return emojiMap[subjectName] || '📖'
  }

  const getSubjectBgColor = (subjectName) => {
    const colorMap = {
      Biology: 'bg-green-100 dark:bg-green-900/30',
      Chemistry: 'bg-purple-100 dark:bg-purple-900/30',
      Physics: 'bg-indigo-100 dark:bg-indigo-900/30',
      Mathematics: 'bg-blue-100 dark:bg-blue-900/30',
      Math: 'bg-blue-100 dark:bg-blue-900/30',
      English: 'bg-red-100 dark:bg-red-900/30',
      History: 'bg-yellow-100 dark:bg-yellow-900/30',
      Geography: 'bg-teal-100 dark:bg-teal-900/30',
      Science: 'bg-orange-100 dark:bg-orange-900/30',
      Computer: 'bg-gray-100 dark:bg-gray-900/30',
      Coding: 'bg-gray-100 dark:bg-gray-900/30',
      Art: 'bg-pink-100 dark:bg-pink-900/30',
      Music: 'bg-purple-100 dark:bg-purple-900/30',
      Sports: 'bg-green-100 dark:bg-green-900/30',
      Dance: 'bg-pink-100 dark:bg-pink-900/30',
      Yoga: 'bg-green-100 dark:bg-green-900/30',
      Cooking: 'bg-orange-100 dark:bg-orange-900/30',
      Photography: 'bg-blue-100 dark:bg-blue-900/30',
      Gardening: 'bg-green-100 dark:bg-green-900/30',
      'Creative Writing': 'bg-yellow-100 dark:bg-yellow-900/30',
      'Public Speaking': 'bg-red-100 dark:bg-red-900/30',
      'Financial Literacy': 'bg-green-100 dark:bg-green-900/30',
      'Life Skills': 'bg-gray-100 dark:bg-gray-900/30',
      'Social Studies': 'bg-gray-100 dark:bg-gray-900/30',
      'Social Science': 'bg-gray-100 dark:bg-gray-900/30',
    }
    return colorMap[subjectName] || 'bg-gray-100 dark:bg-gray-900/30'
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
        <div className="px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 mb-2">⚠️</div>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const studentClass =
    studentData?.student?.class?.parentClass?.name ||
    studentData?.student?.class?.name ||
    'Unknown Class'

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
                for {studentClass}
              </h3>
            </div>

            {/* Board Selection */}
            {isLoadingBoards ? (
              <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : boards.length > 0 ? (
              <Select
                value={selectedBoard?.id || ''}
                onValueChange={(boardId) => {
                  const board = boards.find((b) => b.id === boardId)
                  setSelectedBoard(board)
                }}
              >
                <SelectTrigger className="w-32 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform duration-200">
                  <SelectValue placeholder="Select Board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600">
                No boards available
              </div>
            )}
          </div>

          {/* School Subjects */}
          {selectedBoard && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                School Subjects
              </h4>
              {isLoadingSubjects ? (
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-22 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : subjects.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {subjects.map((subject, index) => {
                    const bgColor = getSubjectBgColor(subject.name)
                    const imgError = imageErrors[subject.id] || false

                    return (
                      <Card
                        key={subject.id}
                        className={`${bgColor} border-none shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 hover:-translate-y-1 animate-card-appear !p-1`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardContent className="p-2">
                          <div className="relative h-22 w-full">
                            <h4 className="absolute top-0 left-0 font-medium text-gray-900 dark:text-white text-sm leading-tight">
                              {subject.name}
                            </h4>

                            {/* Subject icon */}
                            <div className="absolute bottom-1 right-1 w-12 h-12 flex items-end justify-end transition-transform duration-300 hover:rotate-12">
                              {imgError ? (
                                <span className="text-2xl">
                                  {getSubjectEmoji(subject.name)}
                                </span>
                              ) : (
                                <Image
                                  src={subject.photo || '/placeholder.png'}
                                  alt={subject.name}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                  onError={() =>
                                    setImageErrors((prev) => ({
                                      ...prev,
                                      [subject.id]: true,
                                    }))
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No school subjects available
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Beyond School Subjects */}
          {selectedBoard && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Beyond School Subjects
              </h4>
              {isLoadingSubjects ? (
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-22 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : beyondSchoolSubjects.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {beyondSchoolSubjects.map((subject, index) => {
                    const bgColor = getSubjectBgColor(subject.name)
                    const imgError = imageErrors[subject.id] || false

                    return (
                      <Card
                        key={subject.id}
                        className={`${bgColor} border-none shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 hover:-translate-y-1 animate-card-appear !p-1`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardContent className="p-2">
                          <div className="relative h-22 w-full">
                            <h4 className="absolute top-0 left-0 font-medium text-gray-900 dark:text-white text-sm leading-tight">
                              {subject.name}
                            </h4>

                            {/* Subject icon */}
                            <div className="absolute bottom-1 right-1 w-12 h-12 flex items-end justify-end transition-transform duration-300 hover:rotate-12">
                              {imgError ? (
                                <span className="text-2xl">
                                  {getSubjectEmoji(subject.name)}
                                </span>
                              ) : (
                                <Image
                                  src={subject.photo || '/placeholder.png'}
                                  alt={subject.name}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                  onError={() =>
                                    setImageErrors((prev) => ({
                                      ...prev,
                                      [subject.id]: true,
                                    }))
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No beyond school subjects available
                  </p>
                </div>
              )}
            </div>
          )}

          {/* No Content State */}
          {selectedBoard &&
            !isLoadingSubjects &&
            subjects.length === 0 &&
            beyondSchoolSubjects.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No subjects available
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  No subjects have been added to this board yet.
                </p>
              </div>
            )}

          {/* No Board Selected State */}
          {!selectedBoard && !isLoadingBoards && boards.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No boards available
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No boards have been configured for your class yet.
              </p>
            </div>
          )}
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
