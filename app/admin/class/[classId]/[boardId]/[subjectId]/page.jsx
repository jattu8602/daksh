'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Users,
  Video,
  FileText,
  Sheet,
  Plus,
  ArrowLeft,
  UserPlus,
  PlayCircle,
  FileStack,
  Calculator,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function SubjectDetailPage() {
  const params = useParams()
  const { classId, boardId, subjectId } = params

  const [subjectData, setSubjectData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch subject data
  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`/api/subjects/${subjectId}`)
        const result = await response.json()

        if (result.success) {
          setSubjectData(result.subject)
        } else {
          toast.error('Failed to load subject data')
        }
      } catch (error) {
        console.error('Error fetching subject data:', error)
        toast.error('Failed to load subject data')
      } finally {
        setIsLoading(false)
      }
    }

    if (subjectId) {
      fetchSubjectData()
    }
  }, [subjectId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!subjectData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Subject not found</h1>
          <p className="text-muted-foreground">
            The requested subject could not be found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/admin/class/${classId}/${boardId}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Board
            </Button>
          </Link>
        </div>

        <div className="flex items-start gap-6 mb-6">
          {subjectData.photo && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0">
              <Image
                src={subjectData.photo}
                alt={`${subjectData.name} icon`}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">{subjectData.name}</h1>
            </div>

            <p className="text-muted-foreground mb-4">
              Board: {subjectData.board?.name} • Class:{' '}
              {subjectData.board?.class?.name}
            </p>

            {subjectData.description && (
              <p className="text-lg text-muted-foreground">
                {subjectData.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Mentors</p>
                  <p className="text-2xl font-bold">
                    {subjectData._count?.subjectMentors || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Playlists</p>
                  <p className="text-2xl font-bold">
                    {subjectData._count?.subjectPlaylists || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">NCERT</p>
                  <p className="text-2xl font-bold">
                    {subjectData._count?.subjectNcerts || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Sheet className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Sheets</p>
                  <p className="text-2xl font-bold">
                    {subjectData._count?.subjectSheets || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="mentors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mentors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Mentors
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="ncert" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            NCERT
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-2">
            <Sheet className="h-4 w-4" />
            Sheets
          </TabsTrigger>
        </TabsList>

        {/* Mentors Tab */}
        <TabsContent value="mentors" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Subject Mentors</h2>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Mentor
            </Button>
          </div>

          {subjectData.subjectMentors &&
          subjectData.subjectMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectData.subjectMentors.map((subjectMentor) => (
                <Card
                  key={subjectMentor.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                        {subjectMentor.mentor.user.profileImage ? (
                          <Image
                            src={subjectMentor.mentor.user.profileImage}
                            alt={subjectMentor.mentor.user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {subjectMentor.mentor.user.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {subjectMentor.role || 'Instructor'}
                        </p>
                        <Badge
                          variant={
                            subjectMentor.isActive ? 'default' : 'secondary'
                          }
                        >
                          {subjectMentor.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No mentors assigned
              </h3>
              <p className="text-muted-foreground mb-4">
                Assign mentors to teach this subject
              </p>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add First Mentor
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Playlists Tab */}
        <TabsContent value="playlists" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Video Playlists</h2>
            <Button className="gap-2">
              <PlayCircle className="h-4 w-4" />
              Add Playlist
            </Button>
          </div>

          {subjectData.subjectPlaylists &&
          subjectData.subjectPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectData.subjectPlaylists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    {playlist.thumbnail && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-blue-100 to-purple-100">
                        <Image
                          src={playlist.thumbnail}
                          alt={playlist.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold mb-2">{playlist.title}</h3>
                    {playlist.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {playlist.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {playlist.platform || 'Unknown'}
                      </Badge>
                      {playlist.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={playlist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Watch
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
              <p className="text-muted-foreground mb-4">
                Add video playlists for this subject
              </p>
              <Button className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Add First Playlist
              </Button>
            </div>
          )}
        </TabsContent>

        {/* NCERT Tab */}
        <TabsContent value="ncert" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">NCERT Materials</h2>
            <Button className="gap-2">
              <FileStack className="h-4 w-4" />
              Add NCERT
            </Button>
          </div>

          {subjectData.subjectNcerts && subjectData.subjectNcerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectData.subjectNcerts.map((ncert) => (
                <Card
                  key={ncert.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{ncert.title}</h3>
                        {ncert.chapter && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Chapter: {ncert.chapter}
                          </p>
                        )}
                        {ncert.grade && (
                          <p className="text-sm text-muted-foreground mb-3">
                            Grade: {ncert.grade}
                          </p>
                        )}
                        {ncert.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {ncert.description}
                          </p>
                        )}
                        {ncert.fileUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={ncert.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No NCERT materials</h3>
              <p className="text-muted-foreground mb-4">
                Add NCERT books and materials for this subject
              </p>
              <Button className="gap-2">
                <FileStack className="h-4 w-4" />
                Add First NCERT
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Sheets Tab */}
        <TabsContent value="sheets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Worksheets & Practice Sheets
            </h2>
            <Button className="gap-2">
              <Calculator className="h-4 w-4" />
              Add Sheet
            </Button>
          </div>

          {subjectData.subjectSheets && subjectData.subjectSheets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectData.subjectSheets.map((sheet) => (
                <Card
                  key={sheet.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Sheet className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{sheet.title}</h3>
                        <div className="flex gap-2 mb-3">
                          {sheet.type && (
                            <Badge variant="outline" className="capitalize">
                              {sheet.type.replace('_', ' ')}
                            </Badge>
                          )}
                          {sheet.difficulty && (
                            <Badge
                              variant={
                                sheet.difficulty === 'easy'
                                  ? 'default'
                                  : sheet.difficulty === 'medium'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                              className="capitalize"
                            >
                              {sheet.difficulty}
                            </Badge>
                          )}
                        </div>
                        {sheet.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {sheet.description}
                          </p>
                        )}
                        {sheet.fileUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={sheet.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Sheet className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No worksheets yet</h3>
              <p className="text-muted-foreground mb-4">
                Add practice sheets and worksheets for this subject
              </p>
              <Button className="gap-2">
                <Calculator className="h-4 w-4" />
                Add First Worksheet
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
