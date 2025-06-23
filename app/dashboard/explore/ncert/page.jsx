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
    subtitle: 'Class XII - 10th Ed. | by P.S. Verma & BP Pandey',
    coverColor: 'from-green-600 to-yellow-500',
  },
  {
    id: 3,
    title: 'NCERT Physics - Part 1',
    subtitle: 'Class XI - 8th Ed. | by NCERT',
    coverColor: 'from-purple-500 to-indigo-500',
  },
  {
    id: 4,
    title: 'NCERT Physics - Part 2',
    subtitle: 'Class XI - 8th Ed. | by NCERT',
    coverColor: 'from-indigo-600 to-blue-500',
  },
  {
    id: 5,
    title: 'Concepts of Physics Vol 1',
    subtitle: 'Class XI | by H.C. Verma',
    coverColor: 'from-yellow-400 to-orange-500',
  },
  {
    id: 6,
    title: 'Concepts of Physics Vol 2',
    subtitle: 'Class XII | by H.C. Verma',
    coverColor: 'from-red-500 to-pink-500',
  },
  {
    id: 7,
    title: 'NCERT Chemistry - Part 1',
    subtitle: 'Class XII - 9th Ed. | by NCERT',
    coverColor: 'from-green-400 to-teal-500',
  },
  {
    id: 8,
    title: 'NCERT Chemistry - Part 2',
    subtitle: 'Class XII - 9th Ed. | by NCERT',
    coverColor: 'from-teal-600 to-cyan-500',
  },
  {
    id: 9,
    title: 'NCERT Mathematics',
    subtitle: 'Class X - 7th Ed. | by NCERT',
    coverColor: 'from-pink-500 to-yellow-400',
  },
  {
    id: 10,
    title: 'NCERT Science',
    subtitle: 'Class IX - Revised Ed. | by NCERT',
    coverColor: 'from-blue-500 to-purple-600',
  },
  {
    id: 11,
    title: 'NCERT Mathematics',
    subtitle: 'Class VIII - Latest Edition | by NCERT',
    coverColor: 'from-orange-500 to-amber-400',
  },
  {
    id: 12,
    title: 'Lakhmir Singh’s Science',
    subtitle: 'Class VIII | by Lakhmir Singh & Manjit Kaur',
    coverColor: 'from-lime-500 to-green-600',
  },
  {
    id: 13,
    title: 'RD Sharma Mathematics',
    subtitle: 'Class X | by R.D. Sharma',
    coverColor: 'from-cyan-500 to-blue-600',
  },
  {
    id: 14,
    title: 'NCERT Environmental Science',
    subtitle: 'Class IV | by NCERT',
    coverColor: 'from-green-300 to-lime-400',
  },
  {
    id: 15,
    title: 'NCERT Maths Magic',
    subtitle: 'Class III | by NCERT',
    coverColor: 'from-rose-500 to-pink-400',
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
