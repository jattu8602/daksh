export default function RewardsPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Points summary */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="font-bold">Your Points - Total</h2>
        <p className="text-sm text-gray-500">Points available</p>
        <p className="text-2xl font-bold mt-1">249,560</p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-sm text-gray-500">Monthly Points</p>
          <p className="text-xl font-bold">590</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-sm text-gray-500">State Rank</p>
          <p className="text-xl font-bold">#1,438</p>
        </div>
      </div>

      {/* School rank */}
      <div className="bg-white rounded-lg p-3 shadow-sm">
        <p className="text-sm text-gray-500">Current School Rank</p>
        <p className="text-xl font-bold">#56</p>
      </div>

      {/* Leaderboard link */}
      <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div>
          <p className="font-medium">View Leaderboard</p>
          <p className="text-sm text-gray-500">Know your rank now!</p>
        </div>
        <button className="bg-black text-white text-sm py-1 px-4 rounded-md">View</button>
      </div>

      {/* Quiz stats */}
      <p className="text-sm">You have played a total 24 quizzes this month!</p>

      {/* Quiz progress */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm">quiz played</p>
          <p className="text-sm">37/50</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-black h-2 rounded-full" style={{ width: "74%" }}></div>
        </div>
      </div>

      {/* Quiz stats summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-sm text-gray-500">Quiz Attempted</p>
          <p className="text-xl font-bold">53</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-sm text-gray-500">Quiz Won</p>
          <p className="text-xl font-bold">21</p>
        </div>
      </div>

      {/* Performance by subject */}
      <div>
        <h2 className="font-bold mb-3">Overall Performance by Subject</h2>

        {/* Math performance */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Math</h3>
            <p className="text-xs text-gray-500">Monthly 3/10</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <div className="bg-gray-100 h-16 rounded"></div>
              <p className="text-xs text-gray-500 mt-1">Questions Attempted</p>
            </div>
            <div>
              <div className="bg-gray-100 h-8 rounded"></div>
              <p className="text-xs text-gray-500 mt-1">Answered Right</p>
            </div>
            <div>
              <div className="bg-gray-100 h-12 rounded"></div>
              <p className="text-xs text-gray-500 mt-1">Answered Wrong</p>
            </div>
          </div>
        </div>

        {/* Science performance */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Science</h3>
            <p className="text-xs text-gray-500">Monthly 8/10</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <div className="bg-gray-100 h-16 rounded"></div>
              <p className="text-xs text-gray-500 mt-1">Questions Attempted</p>
            </div>
            <div>
              <div className="bg-gray-100 h-12 rounded"></div>
              <p className="text-xs text-gray-500 mt-1">Answered Right</p>
            </div>
            <div>
              <div className="bg-gray-100 h-8 rounded"></div>
              <p className="text-xs text-gray-500 mt-1">Answered Wrong</p>
            </div>
          </div>
        </div>

        {/* Social performance */}
        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Social</h3>
            <p className="text-xs text-gray-500">Monthly 5/10</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <div className="bg-gray-100 h-12 rounded"></div>
              <p className="text-xs text-gray-500 mt-1">Questions Attempted</p>
            </div>
            <div>
              <div className="bg-gray-100 h-8 rounded"></div>
              <p className="text-xs text-gray-500 mt-1">Answered Right</p>
            </div>
            <div>
              <div className="bg-gray-100 h-10 rounded"></div>
              <p className="text-xs text-gray-500 mt-1">Answered Wrong</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
