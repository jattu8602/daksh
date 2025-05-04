export default function HomePage() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, Student!</h1>

      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Upcoming Classes</h2>
          <div className="space-y-2">
            {[
              { subject: "Mathematics", time: "10:00 AM", teacher: "Ms. Johnson" },
              { subject: "Science", time: "11:30 AM", teacher: "Mr. Smith" },
              { subject: "History", time: "2:00 PM", teacher: "Dr. Williams" },
            ].map((cls, index) => (
              <div key={index} className="flex justify-between p-2 border-b">
                <div>
                  <h3 className="font-medium">{cls.subject}</h3>
                  <p className="text-sm text-gray-500">with {cls.teacher}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{cls.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Announcements</h2>
          <div className="space-y-2">
            {[
              { title: "Holiday Notice", date: "June 15, 2023" },
              { title: "Exam Schedule", date: "June 10, 2023" },
              { title: "Sports Day", date: "June 5, 2023" },
            ].map((announcement, index) => (
              <div key={index} className="p-2 border-b">
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="text-sm text-gray-500">{announcement.date}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Popular Resources</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Mathematics Notes", icon: "📘" },
              { name: "Science Lab Manual", icon: "🧪" },
              { name: "History Timeline", icon: "📜" },
              { name: "Literature Quotes", icon: "📚" },
            ].map((resource, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <span className="text-2xl mr-2">{resource.icon}</span>
                <span className="text-sm font-medium">{resource.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}