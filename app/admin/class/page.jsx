'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, School, BookOpen, Plus } from 'lucide-react'
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

  // Fetch classes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes
        const classesResponse = await fetch('/api/classes')
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

      setClasses(prev => [...prev, data.class])
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Class Management System
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          Select a class to access educational content including books, videos,
          audiobooks, and more resources.
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
                Create New Common Class
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
                  {isLoading ? 'Creating...' : 'Create Common Class'}
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
          <Link key={classItem.id} href={`/admin/class/${classItem.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {classItem.name}
                  </CardTitle>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
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
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Total Students
                      </span>
                    </div>
                    <Badge variant="secondary">{classItem.totalStudents || 0}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Total Schools
                      </span>
                    </div>
                    <Badge variant="outline">{classItem.totalSchools || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

