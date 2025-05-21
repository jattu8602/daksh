"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

export default function StatisticsPage() {

  const [isLoaded, setIsLoaded] = useState(true)
  const [animateChart, setAnimateChart] = useState(false)
  const chartRef = useRef(null)

  // Animation states
  const [showPoints, setShowPoints] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [showStreak, setShowStreak] = useState(true)
  const [showReminders, setShowReminders] = useState(true)
  const [showLessons, setShowLessons] = useState(true)
  const [showCompletion, setShowCompletion] = useState(true)
  const [showLearningStats, setShowLearningStats] = useState(true)
  const [showSkills, setShowSkills] = useState(true)
  const [showRatings, setShowRatings] = useState(true)
  const [showDailyStats, setShowDailyStats] = useState(true)
  const [showWeekly, setShowWeekly] = useState(true)

  // Staggered animations
  useEffect(() => {
    if (isLoaded) {
      const timers = [
        setTimeout(() => setAnimateChart(true), 500),
      ]

      return () => timers.forEach((timer) => clearTimeout(timer))
    }
  }, [isLoaded])

  // Line chart data
  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Activity",
        data: [65, 85, 40, 70, 35, 80, 60],
        fill: false,
        borderColor: "#333",
        tension: 0.4,
        pointBackgroundColor: "#333",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#333",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  // Line chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: animateChart ? 2000 : 0,
      easing: "easeInOutQuart",
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hoverRadius: 8,
      },
    },
  }

  // Bar chart data for weekly stats
  const weeklyChartData = {
    labels: ["Mar 20", "Mar 21", "Mar 22", "Mar 23", "Mar 24", "Mar 25", "Mar 26"],
    datasets: [
      {
        label: "Weekly Activity",
        data: [65, 40, 80, 90, 85, 30, 70],
        backgroundColor: "#f0f0f0",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "#e0e0e0",
      },
    ],
  }

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: animateChart ? 1500 : 0,
      delay: (context) => context.dataIndex * 100,
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  }

  // Bar chart data for learning stats
  const learningStatsChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Learning Stats",
        data: [80, 60, 50, 75],
        backgroundColor: "#f0f0f0",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "#e0e0e0",
      },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20">
        <div className="container mx-auto px-4 py-4 space-y-6">
          {/* Points summary */}
          <AnimatePresence>
            {showPoints && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="bg-gray-100 p-3 rounded-lg mr-3">
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
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Your Points</p>
                    <p className="text-xs text-gray-500">Points available</p>
                  </div>
                  <motion.p
                    className="ml-auto text-xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    249,560
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats summary */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-2 gap-x-4 gap-y-3"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Avg. Watch Time</p>
                  <div className="text-right">
                    <p className="font-medium">35 min</p>
                    <p className="text-xs text-green-500">(+23.5%)</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Reviews</p>
                  <div className="text-right">
                    <p className="font-medium">20,254</p>
                    <p className="text-xs text-green-500">(+25.37%)</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Daily</p>
                  <p className="font-medium">74% Completion</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Weekly</p>
                  <p className="font-medium">Consistent Progress</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Streak */}
          <AnimatePresence>
            {showStreak && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">Longest Streak</p>
                  <motion.p
                    className="text-xl font-bold"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3, type: "spring" }}
                  >
                    20 Days
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Daily stamp reminder */}
          <AnimatePresence>
            {showReminders && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-red-600 rounded-lg p-4 flex justify-between items-center text-white relative overflow-hidden mb-4"
                >
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-21%20at%203.13.10%E2%80%AFPM-fIn38Strmi9rs0acG6ElE0p6KVtZhU.png"
                    alt="Daily Stamp"
                    width={400}
                    height={120}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                  />
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg">Daily Stamp Reminder!</h3>
                    <p className="text-sm">Don't miss out! Stamp & score points today</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white text-sm py-2 px-4 rounded-md relative z-10"
                  >
                    Get Stamp
                  </motion.button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm"
                >
                  <div>
                    <p className="font-medium">Daily Stress Reminder</p>
                    <p className="text-sm text-gray-500">Take a break and relax!</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white text-sm py-2 px-4 rounded-md"
                  >
                    Dismiss
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Learning stats */}
          <AnimatePresence>
            {showLessons && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-2 gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <p className="text-sm text-gray-500 mb-1">Total Lessons</p>
                  <motion.p
                    className="text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    249,560
                  </motion.p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <p className="text-sm text-gray-500 mb-1">Average Time</p>
                  <motion.p
                    className="text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    35 min/day
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Course completion */}
          <AnimatePresence>
            {showCompletion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Course Completion</p>
                  <p className="text-lg font-bold">60%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1 overflow-hidden">
                  <motion.div
                    className="bg-black h-3 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "60%" }}
                    transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-500">12 Modules Completed</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Learning stats with chart */}
          <AnimatePresence>
            {showLearningStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Learning Stats 4</p>
                  <div>
                    <motion.p
                      className="text-2xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      24K
                    </motion.p>
                    <p className="text-xs text-green-500 text-right">Weekly +5%</p>
                  </div>
                </div>
                <div className="h-40 mt-4">
                  <Bar data={learningStatsChartData} options={barChartOptions} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Learning skills */}
          <AnimatePresence>
            {showSkills && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="font-medium">Learning Skills</p>
                  <div>
                    <motion.p
                      className="text-2xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      60%
                    </motion.p>
                    <p className="text-xs text-green-500 text-right">Skill Distribution +3%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Python</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gray-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "40%" }}
                        transition={{ delay: 1.1, duration: 1, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">R</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gray-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "80%" }}
                        transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">SQL</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gray-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "25%" }}
                        transition={{ delay: 1.3, duration: 1, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Tableau</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gray-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "75%" }}
                        transition={{ delay: 1.4, duration: 1, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Excel</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gray-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "15%" }}
                        transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ratings */}
          <AnimatePresence>
            {showRatings && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start mb-4">
                  <div>
                    <motion.p
                      className="text-4xl font-bold"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.6, duration: 0.3, type: "spring" }}
                    >
                      4.5
                    </motion.p>
                    <div className="flex text-xl text-black mb-1">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span className="text-gray-300">★</span>
                    </div>
                    <p className="text-sm">246 reviews</p>
                  </div>
                  <div className="ml-auto space-y-1 w-3/5">
                    <div className="flex items-center">
                      <span className="text-sm w-6">5</span>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-black h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "54%" }}
                            transition={{ delay: 1.7, duration: 1, ease: "easeOut" }}
                          ></motion.div>
                        </div>
                      </div>
                      <span className="text-sm w-8 text-right">54%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm w-6">4</span>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-black h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "30%" }}
                            transition={{ delay: 1.8, duration: 1, ease: "easeOut" }}
                          ></motion.div>
                        </div>
                      </div>
                      <span className="text-sm w-8 text-right">30%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm w-6">3</span>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-black h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "10%" }}
                            transition={{ delay: 1.9, duration: 1, ease: "easeOut" }}
                          ></motion.div>
                        </div>
                      </div>
                      <span className="text-sm w-8 text-right">10%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm w-6">2</span>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-black h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "4%" }}
                            transition={{ delay: 2, duration: 1, ease: "easeOut" }}
                          ></motion.div>
                        </div>
                      </div>
                      <span className="text-sm w-8 text-right">4%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm w-6">1</span>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-black h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "2%" }}
                            transition={{ delay: 2.1, duration: 1, ease: "easeOut" }}
                          ></motion.div>
                        </div>
                      </div>
                      <span className="text-sm w-8 text-right">2%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Daily stats with line chart */}
          <AnimatePresence>
            {showDailyStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="mb-4">
                  <p className="font-medium">Learning Stats 1</p>
                  <div className="flex items-baseline">
                    <motion.p
                      className="text-4xl font-bold"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2.2, duration: 0.3, type: "spring" }}
                    >
                      74%
                    </motion.p>
                    <p className="ml-2 text-sm text-gray-500">
                      Daily <span className="text-green-500">+2%</span>
                    </p>
                  </div>
                </div>
                <div className="h-40 relative">
                  <Line data={lineChartData} options={lineChartOptions} />
                  {animateChart && (
                    <>
                      <motion.div
                        className="absolute w-3 h-3 bg-black rounded-full"
                        style={{ top: "30%", left: "75%" }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 3, duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute w-3 h-3 bg-black rounded-full"
                        style={{ top: "70%", left: "60%" }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 3.2, duration: 0.3 }}
                      />
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complete section */}
          <AnimatePresence>
            {showDailyStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Complete</p>
                  <p className="text-lg font-bold">74%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1 overflow-hidden">
                  <motion.div
                    className="bg-black h-3 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "74%" }}
                    transition={{ delay: 2.3, duration: 1.5, ease: "easeOut" }}
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-500">4.7 hours Today, March 21</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weekly stats */}
          <AnimatePresence>
            {showWeekly && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <p className="font-medium mb-1">Weekly</p>
                <p className="text-sm text-gray-500 mb-4">March 20 - March 26</p>
                <div className="h-40">
                  <Bar data={weeklyChartData} options={barChartOptions} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
