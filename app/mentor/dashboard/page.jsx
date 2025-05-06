export default function MentorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mentor Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Content" value="42" icon="📚" />
        <StatCard title="Total Uploads" value="28" icon="📤" />
        <StatCard title="Student Interactions" value="156" icon="👨‍🎓" />
        <StatCard title="Live Sessions" value="8" icon="📹" />
        <StatCard title="Pending Queries" value="12" icon="❓" />
        <StatCard title="Reels Created" value="15" icon="📱" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white shadow">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { action: "uploaded", subject: "Physics - Newton's Laws", time: "2 hours ago" },
                { action: "started", subject: "Live Session on Mathematics", time: "1 day ago" },
                { action: "answered", subject: "Chemistry Query from Student", time: "2 days ago" },
                { action: "created", subject: "Biology Reel on Cell Structure", time: "3 days ago" },
                { action: "scheduled", subject: "Group Discussion on History", time: "5 days ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <div className="flex-1">
                    <p>
                      You <span className="font-medium">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.subject}</span>
                    </p>
                    <p className="text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Student Queries</h2>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { name: "John Smith", subject: "Physics", query: "How do forces work in equilibrium?", time: "1 hour ago" },
                { name: "Sarah Johnson", subject: "Chemistry", query: "Can you explain valence electrons?", time: "3 hours ago" },
                { name: "Mike Davis", subject: "Mathematics", query: "I'm having trouble with trigonometry.", time: "5 hours ago" },
                { name: "Emily Wilson", subject: "Biology", query: "What's the difference between mitosis and meiosis?", time: "1 day ago" },
              ].map((query, index) => (
                <div key={index} className="border-b pb-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{query.name}</h3>
                    <span className="text-sm text-gray-500">{query.time}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{query.subject}</div>
                  <p className="text-sm mt-1">{query.query}</p>
                  <button className="mt-2 text-sm text-blue-600 hover:underline">Reply</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Content Performance</h2>
          <div className="flex space-x-2">
            <button className="text-sm font-medium bg-black text-white px-3 py-1 rounded-md">
              Week
            </button>
            <button className="text-sm text-gray-500 px-3 py-1">
              Month
            </button>
            <button className="text-sm text-gray-500 px-3 py-1">
              Year
            </button>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Comments</th>
                <th className="px-4 py-3">Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: "Newton's Laws of Motion", type: "Video", views: 342, likes: 128, comments: 24, date: "2023-06-15" },
                { title: "Cell Structure and Function", type: "Document", views: 256, likes: 87, comments: 15, date: "2023-06-10" },
                { title: "Photosynthesis Process", type: "Presentation", views: 198, likes: 76, comments: 12, date: "2023-06-08" },
                { title: "Solving Quadratic Equations", type: "Interactive", views: 312, likes: 145, comments: 32, date: "2023-06-05" },
                { title: "History Timeline: World War II", type: "Infographic", views: 289, likes: 112, comments: 18, date: "2023-06-01" },
              ].map((content, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3 font-medium">{content.title}</td>
                  <td className="px-4 py-3">{content.type}</td>
                  <td className="px-4 py-3">{content.views}</td>
                  <td className="px-4 py-3">{content.likes}</td>
                  <td className="px-4 py-3">{content.comments}</td>
                  <td className="px-4 py-3">{content.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <div className="flex items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600 mr-3">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}