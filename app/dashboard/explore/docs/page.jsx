import { Button } from '@/components/ui/button'

export default function DocsContent() {
 const docs = [
   {
     id: 1,
     title: 'Model MPBSE Solutions 2010-2015',
     docCount: '290 docs',
     size: 'Size: 108kb',
   },
   {
     id: 2,
     title: 'Model MPBSE Solutions 2016-2020',
     docCount: '50 docs',
     size: 'Size: 98kb',
   },
   {
     id: 3,
     title: 'CBSE Solutions 2021-2024',
     docCount: '43 docs',
     size: 'Size: 92kb',
   },
   {
     id: 4,
     title: 'CBSE Solutions 2016-2025',
     docCount: '43 docs',
     size: 'Size: 92kb',
   },
   {
     id: 5,
     title: 'CBSE Solutions 2018-2024',
     docCount: '43 docs',
     size: 'Size: 92kb',
   },
   {
     id: 6,
     title: 'ICSE Maths Practice Papers 2015-2020',
     docCount: '70 docs',
     size: 'Size: 115kb',
   },
   {
     id: 7,
     title: 'Class 10 Science NCERT Notes',
     docCount: '38 docs',
     size: 'Size: 85kb',
   },
   {
     id: 8,
     title: 'JEE Physics Formula Handbook',
     docCount: '12 docs',
     size: 'Size: 64kb',
   },
   {
     id: 9,
     title: 'NEET Previous Year Biology Questions',
     docCount: '95 docs',
     size: 'Size: 134kb',
   },
   {
     id: 10,
     title: 'CBSE Class 12 Chemistry Lab Manual',
     docCount: '20 docs',
     size: 'Size: 102kb',
   },
   {
     id: 11,
     title: 'Class 9 Social Science Chapter Notes',
     docCount: '45 docs',
     size: 'Size: 77kb',
   },
   {
     id: 12,
     title: 'MPBSE Hindi Grammar Guide',
     docCount: '25 docs',
     size: 'Size: 56kb',
   },
   {
     id: 13,
     title: 'Class 11 Maths Worksheets',
     docCount: '60 docs',
     size: 'Size: 121kb',
   },
   {
     id: 14,
     title: 'NCERT Class 6 English Notes',
     docCount: '35 docs',
     size: 'Size: 67kb',
   },
   {
     id: 15,
     title: 'CBSE Class 12 Computer Science PYQs',
     docCount: '48 docs',
     size: 'Size: 88kb',
   },
 ]


  return (
    <div className="px-4 space-y-4">
      {docs.map((doc) => (
        <div
          key={doc.id}
          className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border dark:border-gray-800"
        >
          <h3 className="font-semibold text-lg mb-3 dark:text-white">
            {doc.title}
          </h3>
          <div className="flex gap-2 mb-4">
            <span className="bg-yellow-400 text-black px-3 py-2 rounded-full text-sm font-medium dark:bg-yellow-500">
              {doc.docCount}
            </span>
            <span className="bg-yellow-400 text-black px-3 py-2 rounded-full text-sm font-medium dark:bg-yellow-500">
              {doc.size}
            </span>
            <Button
              variant="outline"
              className="bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500 rounded-full px-4 py-1 text-sm ml-auto dark:text-white"
            >
              Preview
            </Button>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-3 dark:bg-green-700 dark:hover:bg-green-800">
            Download
          </Button>
        </div>
      ))}
    </div>
  )
}
