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
        <div className="rounded-lg border border-border bg-background shadow">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-foreground">Recent Activity</h2>
            <button className="text-sm text-primary hover:underline">View All</button>
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
                <div key={index} className="flex items-start space-x-3 text-sm text-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-primary">
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
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background shadow">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-foreground">Schools Overview</h2>
            <button className="text-sm text-primary hover:underline">View All</button>
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
                <div key={index} className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-medium text-foreground">{school.name}</h3>
                    <div className="mt-1 flex text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <span className="mr-1">👨‍🎓</span> {school.students} students
                      </span>
                      <span className="ml-3 flex items-center">
                        <span className="mr-1">👨‍🏫</span> {school.classes} classes
                      </span>
                    </div>
                  </div>
                  <button className="rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-muted">
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-background shadow">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-semibold text-foreground">Recent Exports</h2>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-foreground">
            <thead>
              <tr className="border-b border-border bg-muted text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Exported By</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Springfield_High_Students.xlsx", type: "Excel", date: "2023-06-15", size: "2.4 MB", by: "Admin Sarah" },
                { name: "Riverside_Academy_Classes.xlsx", type: "Excel", date: "2023-06-12", size: "1.8 MB", by: "Admin Mike" },
                { name: "Oakwood_Elementary_Students.csv", type: "CSV", date: "2023-06-10", size: "1.2 MB", by: "Super Admin" },
                { name: "Valley_School_Summary.pdf", type: "PDF", date: "2023-06-05", size: "3.6 MB", by: "Admin Sarah" },
                { name: "All_Schools_Report.xlsx", type: "Excel", date: "2023-06-01", size: "5.2 MB", by: "Super Admin" },
              ].map((file, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="px-4 py-3 font-medium">{file.name}</td>
                  <td className="px-4 py-3">{file.type}</td>
                  <td className="px-4 py-3">{file.date}</td>
                  <td className="px-4 py-3">{file.size}</td>
                  <td className="px-4 py-3">{file.by}</td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:underline">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, change, icon }) {
  const isPositive = change.startsWith("+");

  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          <p className={`mt-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {change} since last month
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
