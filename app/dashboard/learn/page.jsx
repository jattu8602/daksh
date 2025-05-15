export default function LearnPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Learn</h1>

      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">My Courses</h2>
          <div className="space-y-3">
            {[
              {
                title: "Algebra Fundamentals",
                progress: 75,
                lessons: 12,
                completed: 9,
                img: "📘"
              },
              {
                title: "Physics: Forces and Motion",
                progress: 40,
                lessons: 10,
                completed: 4,
                img: "🔭"
              },
              {
                title: "Literature Classics",
                progress: 20,
                lessons: 15,
                completed: 3,
                img: "📚"
              },
            ].map((course, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="flex p-3">
                  <div className="bg-gray-100 h-16 w-16 rounded-lg flex items-center justify-center text-3xl mr-3">
                    {course.img}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{course.title}</h3>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{course.completed} of {course.lessons} lessons</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            View All Courses
          </button>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Recommended For You</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Chemistry Basics", level: "Beginner", duration: "4 weeks", img: "🧪" },
              { title: "World History", level: "Intermediate", duration: "6 weeks", img: "🌍" },
              { title: "Computer Science", level: "Advanced", duration: "8 weeks", img: "💻" },
              { title: "Creative Writing", level: "All Levels", duration: "5 weeks", img: "✍️" },
            ].map((course, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 h-24 flex items-center justify-center text-4xl">
                  {course.img}
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm">{course.title}</h3>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{course.level}</span>
                    <span className="text-xs text-gray-500">{course.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Learning Resources</h2>
          <div className="space-y-3">
            {[
              { title: "Study Guide: Effective Note Taking", type: "PDF", size: "2.4 MB", icon: "📝" },
              { title: "Math Formula Sheet", type: "PDF", size: "1.2 MB", icon: "📊" },
              { title: "Periodic Table Reference", type: "Image", size: "0.8 MB", icon: "📋" },
              { title: "Grammar Rules Handbook", type: "Document", size: "3.5 MB", icon: "📖" },
            ].map((resource, index) => (
              <div key={index} className="flex items-center p-3 border rounded-lg">
                <div className="bg-gray-100 h-10 w-10 rounded flex items-center justify-center text-xl mr-3">
                  {resource.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{resource.title}</h3>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{resource.type}</span>
                    <span>{resource.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}