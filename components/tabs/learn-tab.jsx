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

// Cache keys for local storage
const CACHE_KEYS = {
  STUDENT_DATA: 'learn_tab_student_data',
  BOARDS_DATA: 'learn_tab_boards_data',
  SUBJECTS_DATA: 'learn_tab_subjects_data',
  BEYOND_SUBJECTS_DATA: 'learn_tab_beyond_subjects_data',
  CACHE_TIMESTAMP: 'learn_tab_cache_timestamp',
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000

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

  // Cache management functions
  const getCachedData = (key) => {
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error)
    }
    return null
  }

  const setCachedData = (key, data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error writing cache:', error)
    }
  }

  const clearCache = () => {
    try {
      Object.values(CACHE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  const refreshCache = () => {
    clearCache()
    window.location.reload()
  }

  const refreshSubjects = async () => {
    if (!selectedBoard) return

    try {
      // Clear only subjects cache
      localStorage.removeItem(CACHE_KEYS.SUBJECTS_DATA)
      localStorage.removeItem(CACHE_KEYS.BEYOND_SUBJECTS_DATA)

      // Fetch fresh subjects data
      setIsLoadingSubjects(true)
      const subjectsResponse = await fetch(`/api/boards/${selectedBoard.id}`)

      if (subjectsResponse.ok) {
        const subjectsData = await subjectsResponse.json()
        if (subjectsData.success) {
          const validSubjects = (subjectsData.board.subjects || []).filter(
            (subject) =>
              subject &&
              subject.id &&
              subject.name &&
              subject.id.trim() !== '' &&
              subject.name.trim() !== ''
          )
          setSubjects(validSubjects)
          setCachedData(CACHE_KEYS.SUBJECTS_DATA, validSubjects)

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
          setBeyondSchoolSubjects(validBeyondSubjects)
          setCachedData(CACHE_KEYS.BEYOND_SUBJECTS_DATA, validBeyondSubjects)

          // Update cache timestamp
          setCachedData(CACHE_KEYS.CACHE_TIMESTAMP, Date.now())
        }
      }
    } catch (error) {
      console.error('Error refreshing subjects:', error)
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  // Check for cache invalidation (when admin adds new subjects)
  const checkForUpdates = async () => {
    try {
      // Get the last cache timestamp
      const lastCacheTime = getCachedData(CACHE_KEYS.CACHE_TIMESTAMP)
      if (!lastCacheTime) return

      // Only check for updates if cache is older than 30 minutes
      // This prevents constant checking and keeps the app fast
      const thirtyMinutes = 30 * 60 * 1000
      if (Date.now() - lastCacheTime < thirtyMinutes) {
        return // Cache is fresh enough, don't check
      }

      // Lightweight check for updates
      const response = await fetch('/api/boards?checkUpdates=true', {
        method: 'HEAD', // Just check headers, don't download data
      })

      if (response.ok) {
        const lastModified = response.headers.get('last-modified')
        if (lastModified && new Date(lastModified) > new Date(lastCacheTime)) {
          // Only clear subjects cache, keep student and boards data
          // This way we only reload what changed
          localStorage.removeItem(CACHE_KEYS.SUBJECTS_DATA)
          localStorage.removeItem(CACHE_KEYS.BEYOND_SUBJECTS_DATA)
          console.log('Subjects cache invalidated - new subjects available')
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoadingStudent(true)
        setError(null)

        // Check for updates first
        await checkForUpdates()

        // Check for cached student data
        const cachedStudentData = getCachedData(CACHE_KEYS.STUDENT_DATA)
        let currentStudentData = null

        if (cachedStudentData) {
          setStudentData(cachedStudentData)
          currentStudentData = cachedStudentData
          console.log('Loaded student data from cache')
        } else {
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
          currentStudentData = sessionData.user
          setCachedData(CACHE_KEYS.STUDENT_DATA, sessionData.user)
        }

        // Fetch boards for the student's class
        const classId =
          currentStudentData?.student?.class?.parentClassId ||
          currentStudentData?.student?.class?.id

        if (!classId) {
          throw new Error('Class ID not found')
        }

        // Check for cached boards data
        const cachedBoardsData = getCachedData(CACHE_KEYS.BOARDS_DATA)
        if (cachedBoardsData) {
          setBoards(cachedBoardsData)
          console.log('Loaded boards from cache')
          if (cachedBoardsData.length > 0) {
            setSelectedBoard(cachedBoardsData[0])
          }
        } else {
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
            setCachedData(CACHE_KEYS.BOARDS_DATA, validBoards)
            // Auto-select first board if available
            if (validBoards.length > 0) {
              setSelectedBoard(validBoards[0])
            }
          }
        }

        // Set cache timestamp when fresh data is fetched
        setCachedData(CACHE_KEYS.CACHE_TIMESTAMP, Date.now())
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

        // Check for cached subjects
        const cachedSubjects = getCachedData(CACHE_KEYS.SUBJECTS_DATA)
        const cachedBeyondSubjects = getCachedData(
          CACHE_KEYS.BEYOND_SUBJECTS_DATA
        )

        if (cachedSubjects && cachedBeyondSubjects) {
          setSubjects(cachedSubjects)
          setBeyondSchoolSubjects(cachedBeyondSubjects)
          console.log('Loaded subjects from cache')
          setIsLoadingSubjects(false)
          return // Don't fetch if we have cached data
        }

        // Only fetch if we don't have cached data
        console.log('Fetching fresh subjects data')
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
            setSubjects(validSubjects)
            setCachedData(CACHE_KEYS.SUBJECTS_DATA, validSubjects)

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
            setBeyondSchoolSubjects(validBeyondSubjects)
            setCachedData(CACHE_KEYS.BEYOND_SUBJECTS_DATA, validBeyondSubjects)
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

  // Fixed sequential colors for 24 subject components
  const getComponentColor = (index) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900/30',
      'bg-green-100 dark:bg-green-900/30',
      'bg-purple-100 dark:bg-purple-900/30',
      'bg-orange-100 dark:bg-orange-900/30',
      'bg-pink-100 dark:bg-pink-900/30',
      'bg-indigo-100 dark:bg-indigo-900/30',
      'bg-teal-100 dark:bg-teal-900/30',
      'bg-red-100 dark:bg-red-900/30',
      'bg-yellow-100 dark:bg-yellow-900/30',
      'bg-emerald-100 dark:bg-emerald-900/30',
      'bg-violet-100 dark:bg-violet-900/30',
      'bg-amber-100 dark:bg-amber-900/30',
      'bg-rose-100 dark:bg-rose-900/30',
      'bg-cyan-100 dark:bg-cyan-900/30',
      'bg-lime-100 dark:bg-lime-900/30',
      'bg-sky-100 dark:bg-sky-900/30',
      'bg-fuchsia-100 dark:bg-fuchsia-900/30',
      'bg-slate-100 dark:bg-slate-900/30',
      'bg-stone-100 dark:bg-stone-900/30',
      'bg-zinc-100 dark:bg-zinc-900/30',
      'bg-neutral-100 dark:bg-neutral-900/30',
      'bg-gray-100 dark:bg-gray-900/30',
      'bg-slate-200 dark:bg-slate-800/30',
      'bg-stone-200 dark:bg-stone-800/30',
    ]
    return colors[index % colors.length]
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
                    const bgColor = getComponentColor(index)
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
                    const bgColor = getComponentColor(index)
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
