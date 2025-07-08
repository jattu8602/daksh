export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Schools" value="24" change="+3" icon="🏫" />
        <Card title="Total Classes" value="86" change="+12" icon="👨‍🏫" />
        <Card title="Total Students" value="1,283" change="+42" icon="👨‍🎓" />
        <Card title="Total Mentors" value="48" change="+5" icon="👨‍💼" />
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
                { type: "Student", action: "added", subject: "John Doe", time: "2 hours ago", user: "Admin Sarah" },
                { type: "Class", action: "updated", subject: "10th Grade Science", time: "5 hours ago", user: "Admin Mike" },
                { type: "School", action: "added", subject: "Springfield High", time: "1 day ago", user: "Super Admin" },
                { type: "Student", action: "exported", subject: "Class 9 Data", time: "2 days ago", user: "Admin Sarah" },
                { type: "Mentor", action: "added", subject: "Mary Johnson", time: "3 days ago", user: "Super Admin" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    {activity.type === "Student" ? "👨‍🎓" :
                     activity.type === "Class" ? "👨‍🏫" :
                     activity.type === "School" ? "🏫" : "👨‍💼"}
                  </span>
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action} {activity.type.toLowerCase()}{" "}
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
            <h2 className="font-semibold">Schools Overview</h2>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { name: "Springfield High School", students: 342, classes: 12 },
                { name: "Riverside Academy", students: 287, classes: 10 },
                { name: "Oakwood Elementary", students: 196, classes: 8 },
                { name: "Valley Middle School", students: 254, classes: 9 },
                { name: "Hillside Preparatory", students: 204, classes: 7 },
              ].map((school, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">{school.name}</h3>
                    <div className="mt-1 flex text-xs text-gray-500">
                      <span className="flex items-center">
                        <span className="mr-1">👨‍🎓</span> {school.students} students
                      </span>
                      <span className="ml-3 flex items-center">
                        <span className="mr-1">👨‍🏫</span> {school.classes} classes
                      </span>
                    </div>
                  </div>
                  <button className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-gray-50">
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function Card({ title, value, change, icon }) {
  const isPositive = change.startsWith("+");

  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className={`mt-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {change} since last month
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
