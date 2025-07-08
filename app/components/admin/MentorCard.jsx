import Image from 'next/image'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const MentorCard = ({
  mentor,
  onEdit,
  onDelete,
  onResetPassword,
  currentPage = 1,
  searchTerm = '',
}) => {
  // Construct the href with return parameters
  const getHref = () => {
    const params = new URLSearchParams()
    if (currentPage && currentPage !== 1) {
      params.set('returnPage', currentPage.toString())
    }
    if (searchTerm) {
      params.set('returnSearch', searchTerm)
    }
    const queryString = params.toString()
    return `/admin/mentors/${mentor.id}${queryString ? `?${queryString}` : ''}`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col h-full">
      <Link href={getHref()} className="block p-6 flex-grow">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Image
              src={mentor.profilePhoto}
              alt={mentor.name}
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <h3
                className="text-lg font-bold text-gray-800 truncate"
                title={mentor.name}
              >
                {mentor.name}
              </h3>
            </div>
            <p className="text-sm text-gray-500">@{mentor.username}</p>
          </div>
        </div>

        {mentor.skills && mentor.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {mentor.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {mentor.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-md text-xs font-medium">
                +{mentor.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </Link>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            mentor.isOrganic
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {mentor.isOrganic ? 'Organic' : 'Inorganic'}
        </span>
        <div className="flex items-center space-x-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-800"
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{' '}
                  <span className="font-semibold">{mentor.name}</span> and
                  remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(mentor.id)}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}

export default MentorCard
