'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Plus,
  Users,
  Video,
  FileText,
  Sheet,
  Edit2,
  Trash2,
  MoreVertical,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import toast from 'react-hot-toast'

export default function BoardDetailPage() {
  const params = useParams()
  const { classId, boardId } = params

  const [boardData, setBoardData] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [beyondSchoolSubjects, setBeyondSchoolSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Add subject state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [subjectDescription, setSubjectDescription] = useState('')
  const [subjectPhoto, setSubjectPhoto] = useState('')
  const [isAddLoading, setIsAddLoading] = useState(false)

  // Add beyond school subject state
  const [isAddBeyondDialogOpen, setIsAddBeyondDialogOpen] = useState(false)
  const [beyondSubjectName, setBeyondSubjectName] = useState('')
  const [beyondSubjectDescription, setBeyondSubjectDescription] = useState('')
  const [beyondSubjectPhoto, setBeyondSubjectPhoto] = useState('')
  const [isAddBeyondLoading, setIsAddBeyondLoading] = useState(false)

  // Edit subject state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [editSubjectName, setEditSubjectName] = useState('')
  const [editSubjectDescription, setEditSubjectDescription] = useState('')
  const [editSubjectPhoto, setEditSubjectPhoto] = useState('')
  const [isEditLoading, setIsEditLoading] = useState(false)

  // Delete subject state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingSubject, setDeletingSubject] = useState(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  // Fetch board data and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch board data
        const boardResponse = await fetch(`/api/boards/${boardId}`)
        const boardResult = await boardResponse.json()

        if (!boardResponse.ok) {
          throw new Error(boardResult.error || 'Failed to fetch board data')
        }

        if (boardResult.success) {
          setBoardData(boardResult.board)
          setSubjects(boardResult.board.subjects || [])
          setBeyondSchoolSubjects(boardResult.board.beyondSchoolSubjects || [])
        } else {
          throw new Error(boardResult.error || 'Failed to fetch board data')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error(error.message || 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    if (boardId) {
      fetchData()
    }
  }, [boardId])

  const handleAddSubject = async () => {
    if (!subjectName.trim()) {
      toast.error('Please enter a subject name')
      return
    }

    setIsAddLoading(true)
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: subjectName.trim(),
          description: subjectDescription.trim(),
          photo: subjectPhoto.trim(),
          boardId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subject')
      }

      setSubjects((prev) => [...prev, data.subject])
      toast.success('Subject created successfully')
      setIsAddDialogOpen(false)
      setSubjectName('')
      setSubjectDescription('')
      setSubjectPhoto('')
    } catch (error) {
      toast.error(error.message || 'Failed to create subject')
      console.error('Error creating subject:', error)
    } finally {
      setIsAddLoading(false)
    }
  }

  const handleAddBeyondSubject = async () => {
    if (!beyondSubjectName.trim()) {
      toast.error('Please enter a subject name')
      return
    }

    setIsAddBeyondLoading(true)
    try {
      const response = await fetch('/api/beyond-school-subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: beyondSubjectName.trim(),
          description: beyondSubjectDescription.trim(),
          photo: beyondSubjectPhoto.trim(),
          boardId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create beyond school subject')
      }

      setBeyondSchoolSubjects((prev) => [...prev, data.beyondSchoolSubject])
      toast.success('Beyond school subject created successfully')
      setIsAddBeyondDialogOpen(false)
      setBeyondSubjectName('')
      setBeyondSubjectDescription('')
      setBeyondSubjectPhoto('')
    } catch (error) {
      toast.error(error.message || 'Failed to create beyond school subject')
      console.error('Error creating beyond school subject:', error)
    } finally {
      setIsAddBeyondLoading(false)
    }
  }

  const handleEditSubject = (subject) => {
    setEditingSubject(subject)
    setEditSubjectName(subject.name)
    setEditSubjectDescription(subject.description || '')
    setEditSubjectPhoto(subject.photo || '')
    setIsEditDialogOpen(true)
  }

  const handleUpdateSubject = async () => {
    if (!editSubjectName.trim()) {
      toast.error('Please enter a subject name')
      return
    }

    setIsEditLoading(true)
    try {
      const response = await fetch(`/api/subjects/${editingSubject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editSubjectName.trim(),
          description: editSubjectDescription.trim(),
          photo: editSubjectPhoto.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update subject')
      }

      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === editingSubject.id
            ? { ...subject, ...data.subject }
            : subject
        )
      )
      toast.success('Subject updated successfully')
      setIsEditDialogOpen(false)
      setEditingSubject(null)
      setEditSubjectName('')
      setEditSubjectDescription('')
      setEditSubjectPhoto('')
    } catch (error) {
      toast.error(error.message || 'Failed to update subject')
      console.error('Error updating subject:', error)
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleDeleteSubject = (subject) => {
    setDeletingSubject(subject)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleteLoading(true)
    try {
      const response = await fetch(`/api/subjects/${deletingSubject.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete subject')
      }

      setSubjects((prev) =>
        prev.filter((subject) => subject.id !== deletingSubject.id)
      )
      toast.success('Subject deleted successfully')
      setIsDeleteDialogOpen(false)
      setDeletingSubject(null)
    } catch (error) {
      toast.error(error.message || 'Failed to delete subject')
      console.error('Error deleting subject:', error)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!boardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Board not found</h1>
          <p className="text-muted-foreground">
            The requested board could not be found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/admin/class/${classId}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to {boardData.class.name}
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">{boardData.name}</h1>
              <Badge variant="outline">{boardData.code.toUpperCase()}</Badge>
            </div>
            <p className="text-muted-foreground">
              Manage subjects for {boardData.class.name} - {boardData.name}{' '}
              board
            </p>
          </div>
        </div>

        {/* Board Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    School Subjects
                  </p>
                  <p className="text-2xl font-bold">{subjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Beyond School Subjects
                  </p>
                  <p className="text-2xl font-bold">
                    {beyondSchoolSubjects.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Mentors</p>
                  <p className="text-2xl font-bold">
                    {subjects.reduce(
                      (sum, subject) =>
                        sum + (subject._count?.subjectMentors || 0),
                      0
                    ) +
                      beyondSchoolSubjects.reduce(
                        (sum, subject) =>
                          sum + (subject._count?.subjectMentors || 0),
                        0
                      )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Playlists
                  </p>
                  <p className="text-2xl font-bold">
                    {subjects.reduce(
                      (sum, subject) =>
                        sum + (subject._count?.subjectPlaylists || 0),
                      0
                    ) +
                      beyondSchoolSubjects.reduce(
                        (sum, subject) =>
                          sum + (subject._count?.subjectPlaylists || 0),
                        0
                      )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* School Subjects Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">School Subjects</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add School Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New School Subject
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subjectName">Subject Name</Label>
                  <Input
                    id="subjectName"
                    placeholder="e.g., Mathematics, Science, History"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    disabled={isAddLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjectDescription">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="subjectDescription"
                    placeholder="Brief description of the subject"
                    value={subjectDescription}
                    onChange={(e) => setSubjectDescription(e.target.value)}
                    disabled={isAddLoading}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjectPhoto">
                    Subject Photo URL (Optional)
                  </Label>
                  <Input
                    id="subjectPhoto"
                    placeholder="https://example.com/subject-image.jpg"
                    value={subjectPhoto}
                    onChange={(e) => setSubjectPhoto(e.target.value)}
                    disabled={isAddLoading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddSubject}
                    className="flex-1"
                    disabled={isAddLoading}
                  >
                    {isAddLoading ? 'Creating...' : 'Create Subject'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1"
                    disabled={isAddLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="hover:shadow-lg transition-shadow group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/admin/class/${classId}/${boardId}/${subject.id}`}
                    className="flex-1"
                  >
                    <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer">
                      {subject.name}
                    </CardTitle>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditSubject(subject)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteSubject(subject)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {subject.photo && (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    <Image
                      src={subject.photo}
                      alt={`${subject.name} illustration`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {subject.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {subject.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mentors</p>
                      <p className="text-sm font-semibold">
                        {subject._count?.subjectMentors || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Playlists</p>
                      <p className="text-sm font-semibold">
                        {subject._count?.subjectPlaylists || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">NCERT</p>
                      <p className="text-sm font-semibold">
                        {subject._count?.subjectNcerts || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sheet className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Sheets</p>
                      <p className="text-sm font-semibold">
                        {subject._count?.subjectSheets || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No school subjects yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start by adding school subjects for this board
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First School Subject
            </Button>
          </div>
        )}
      </div>

      {/* Beyond School Subjects Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Beyond School Subjects</h2>
          <Dialog
            open={isAddBeyondDialogOpen}
            onOpenChange={setIsAddBeyondDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Beyond School Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Beyond School Subject
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="beyondSubjectName">Subject Name</Label>
                  <Input
                    id="beyondSubjectName"
                    placeholder="e.g., Coding, Art, Music, Sports"
                    value={beyondSubjectName}
                    onChange={(e) => setBeyondSubjectName(e.target.value)}
                    disabled={isAddBeyondLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beyondSubjectDescription">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="beyondSubjectDescription"
                    placeholder="Brief description of the subject"
                    value={beyondSubjectDescription}
                    onChange={(e) =>
                      setBeyondSubjectDescription(e.target.value)
                    }
                    disabled={isAddBeyondLoading}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beyondSubjectPhoto">
                    Subject Photo URL (Optional)
                  </Label>
                  <Input
                    id="beyondSubjectPhoto"
                    placeholder="https://example.com/subject-image.jpg"
                    value={beyondSubjectPhoto}
                    onChange={(e) => setBeyondSubjectPhoto(e.target.value)}
                    disabled={isAddBeyondLoading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddBeyondSubject}
                    className="flex-1"
                    disabled={isAddBeyondLoading}
                  >
                    {isAddBeyondLoading ? 'Creating...' : 'Create Subject'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddBeyondDialogOpen(false)}
                    className="flex-1"
                    disabled={isAddBeyondLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Beyond School Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {beyondSchoolSubjects.map((subject) => (
            <Card
              key={subject.id}
              className="hover:shadow-lg transition-shadow group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/admin/class/${classId}/${boardId}/${subject.id}?type=beyond`}
                    className="flex-1"
                  >
                    <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer">
                      {subject.name}
                    </CardTitle>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditSubject(subject)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteSubject(subject)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {subject.photo && (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
                    <Image
                      src={subject.photo}
                      alt={`${subject.name} illustration`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {subject.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {subject.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mentors</p>
                      <p className="text-sm font-semibold">
                        {subject._count?.subjectMentors || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Playlists</p>
                      <p className="text-sm font-semibold">
                        {subject._count?.subjectPlaylists || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">NCERT</p>
                      <p className="text-sm font-semibold">
                        {subject._count?.subjectNcerts || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sheet className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Sheets</p>
                      <p className="text-sm font-semibold">
                        {subject._count?.subjectSheets || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {beyondSchoolSubjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No beyond school subjects yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start by adding beyond school subjects for this board
            </p>
            <Button
              onClick={() => setIsAddBeyondDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Your First Beyond School Subject
            </Button>
          </div>
        )}
      </div>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              Edit Subject
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="editSubjectName">Subject Name</Label>
              <Input
                id="editSubjectName"
                placeholder="e.g., Mathematics, Science, History"
                value={editSubjectName}
                onChange={(e) => setEditSubjectName(e.target.value)}
                disabled={isEditLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editSubjectDescription">
                Description (Optional)
              </Label>
              <Textarea
                id="editSubjectDescription"
                placeholder="Brief description of the subject"
                value={editSubjectDescription}
                onChange={(e) => setEditSubjectDescription(e.target.value)}
                disabled={isEditLoading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editSubjectPhoto">
                Subject Photo URL (Optional)
              </Label>
              <Input
                id="editSubjectPhoto"
                placeholder="https://example.com/subject-image.jpg"
                value={editSubjectPhoto}
                onChange={(e) => setEditSubjectPhoto(e.target.value)}
                disabled={isEditLoading}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleUpdateSubject}
                className="flex-1"
                disabled={isEditLoading}
              >
                {isEditLoading ? 'Updating...' : 'Update Subject'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
                disabled={isEditLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Subject Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the subject "{deletingSubject?.name}" and all its
              associated content including mentors, playlists, NCERT materials,
              and worksheets. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
