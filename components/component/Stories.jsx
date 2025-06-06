export default function Stories({ stories }) {
  return (
    <div>
      {/* Stories */}
      <div className=" pt-4 pb-1">
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center first:ml-3">
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    story.hasStory && !story.isWatched
                      ? 'bg-gradient-to-tr from-yellow-500 to-pink-500 p-[3px]'
                      : ''
                  }`}
                >
                  <div className="bg-white rounded-full p-[3px] w-full h-full flex items-center justify-center">
                    <img
                      src={story.avatar || '/placeholder.svg'}
                      alt={story.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs mt-1 truncate w-16 text-center">
                {story.username}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
