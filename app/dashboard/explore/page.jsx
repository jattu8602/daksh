export default function ExplorePage() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>

      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Featured Content</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { title: "Science Exhibition 2023", image: "🔬", type: "Event", date: "June 20, 2023" },
              { title: "Mathematics Competition", image: "🧮", type: "Competition", date: "July 5, 2023" },
              { title: "Coding Workshop", image: "💻", type: "Workshop", date: "June 25, 2023" },
            ].map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 h-32 flex items-center justify-center text-5xl">
                  {item.image}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-lg">{item.title}</h3>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded">{item.type}</span>
                    <span className="text-gray-500">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Popular Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Science", icon: "🧪", count: 24 },
              { name: "Mathematics", icon: "📐", count: 18 },
              { name: "Literature", icon: "📚", count: 15 },
              { name: "History", icon: "🏛️", count: 12 },
              { name: "Arts", icon: "🎨", count: 10 },
              { name: "Sports", icon: "⚽", count: 8 },
            ].map((category, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <span className="text-2xl mr-2">{category.icon}</span>
                <div>
                  <span className="text-sm font-medium">{category.name}</span>
                  <p className="text-xs text-gray-500">{category.count} items</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Trending Hashtags</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "scienceweek", "mathchallenge", "bookreview", "healthyliving",
              "examtips", "artcontest", "summerproject", "sportsfest"
            ].map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}