'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  School,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ClassesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [className, setClassName] = useState('')
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Edit state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [editClassName, setEditClassName] = useState('')
  const [isEditLoading, setIsEditLoading] = useState(false)

  // Delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingClass, setDeletingClass] = useState(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  // Fetch classes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch only template/parent classes (isCommon: true)
        const classesResponse = await fetch('/api/classes?isCommon=true')
        const classesData = await classesResponse.json()
        if (classesData.success) {
          setClasses(classesData.classes)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data')
      }
    }

    fetchData()
  }, [])

  const handleAddClass = async () => {
    if (!className.trim()) {
      toast.error('Please enter a class name')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: className.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create class')
      }

      setClasses((prev) => [...prev, data.class])
      toast.success('Class created successfully')
      setIsDialogOpen(false)
      setClassName('')
    } catch (error) {
      toast.error(error.message || 'Failed to create class')
      console.error('Error creating class:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClass = (classItem) => {
    setEditingClass(classItem)
    setEditClassName(classItem.name)
    setIsEditDialogOpen(true)
  }

  const handleUpdateClass = async () => {
    if (!editClassName.trim()) {
      toast.error('Please enter a class name')
      return
    }

    setIsEditLoading(true)
    try {
      const response = await fetch(`/api/classes/${editingClass.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editClassName.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update class')
      }

      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === editingClass.id ? { ...cls, name: data.class.name } : cls
        )
      )
      toast.success('Class updated successfully')
      setIsEditDialogOpen(false)
      setEditingClass(null)
      setEditClassName('')
    } catch (error) {
      toast.error(error.message || 'Failed to update class')
      console.error('Error updating class:', error)
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleDeleteClass = (classItem) => {
    setDeletingClass(classItem)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleteLoading(true)
    try {
      const response = await fetch(`/api/classes/${deletingClass.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete class')
      }

      setClasses((prev) => prev.filter((cls) => cls.id !== deletingClass.id))
      toast.success('Class deleted successfully')
      setIsDeleteDialogOpen(false)
      setDeletingClass(null)
    } catch (error) {
      toast.error(error.message || 'Failed to delete class')
      console.error('Error deleting class:', error)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Global Class Templates
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          Manage global class templates that will be used across all schools.
          Add subjects, mentors, and content here to make them available to all
          school instances.
        </p>
      </div>

      {/* Add New Class Button */}
      <div className="flex justify-center mb-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add New Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Global Class Template
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  placeholder="e.g., 11th Class, Pre-K, etc."
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAddClass}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Global Template'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.map((classItem) => (
          <Card
            key={classItem.id}
            className="hover:shadow-lg transition-shadow group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Link href={`/admin/class/${classItem.id}`} className="flex-1">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer">
                    {classItem.name}
                  </CardTitle>
                </Link>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditClass(classItem)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClass(classItem)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {classItem.hasImage && (
                <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                  <Image
                    src={`/placeholder.svg?height=128&width=200&text=${classItem.id}`}
                    alt={`${classItem.name} illustration`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Total Boards
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {classItem.totalBoards || classItem._count?.boards || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      School Instances
                    </span>
                  </div>
                  <Badge variant="outline">
                    {classItem.totalSchools ||
                      classItem._count?.schoolClasses ||
                      0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              Edit Class
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="editClassName">Class Name</Label>
              <Input
                id="editClassName"
                placeholder="e.g., 11th Class, Pre-K, etc."
                value={editClassName}
                onChange={(e) => setEditClassName(e.target.value)}
                disabled={isEditLoading}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleUpdateClass}
                className="flex-1"
                disabled={isEditLoading}
              >
                {isEditLoading ? 'Updating...' : 'Update Class'}
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

      {/* Delete Class Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class "{deletingClass?.name}" and
              all its associated data. This action cannot be undone.
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
