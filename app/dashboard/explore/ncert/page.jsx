import { Button } from '@/components/ui/button'

export default function NCERTContent() {
  const ncertBooks = [
    {
      id: 1,
      title: 'NCERT Biology- Part 1',
      subtitle: 'Class XII - 10th Ed. | by NCERT',
      coverColor: 'from-blue-400 to-green-500',
    },
    {
      id: 2,
      title: "S Chand's Biology",
      subtitle: 'Class XII - 10th Ed. | by by P.S. Verma & BP Pandey',
      coverColor: 'from-green-600 to-yellow-500',
    },
  ]

  return (
    <div className="px-4 space-y-4">
      {ncertBooks.map((book) => (
        <div
          key={book.id}
          className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border dark:border-gray-800"
        >
          <div className="flex gap-4">
            <div
              className={`w-20 h-28 bg-gradient-to-br ${book.coverColor} rounded-lg flex items-center justify-center`}
            >
              <div className="text-white text-xs font-bold text-center px-2">
                BIOLOGY
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 dark:text-white">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {book.subtitle}
              </p>
              <Button
                variant="outline"
                className="bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500 rounded-full px-4 py-1 text-sm dark:text-white"
              >
                Preview
              </Button>
            </div>
          </div>
          <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white rounded-full py-3 dark:bg-green-700 dark:hover:bg-green-800">
            Download
          </Button>
        </div>
      ))}
    </div>
  )
}
