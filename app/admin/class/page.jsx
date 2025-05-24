'use client'

import { useState } from 'react'
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

const classes = [
  { id: '1st', name: '1st Class', students: 245, schools: 12, hasImage: true },
  { id: '2nd', name: '2nd Class', students: 198, schools: 10, hasImage: true },
  { id: '3rd', name: '3rd Class', students: 312, schools: 15, hasImage: true },
  { id: '4th', name: '4th Class', students: 287, schools: 13, hasImage: true },
  { id: '5th', name: '5th Class', students: 156, schools: 8, hasImage: false },
  { id: '6th', name: '6th Class', students: 203, schools: 11, hasImage: false },
  { id: '7th', name: '7th Class', students: 178, schools: 9, hasImage: false },
  { id: '8th', name: '8th Class', students: 234, schools: 12, hasImage: false },
  { id: '9th', name: '9th Class', students: 189, schools: 10, hasImage: false },
  {
    id: '10th',
    name: '10th Class',
    students: 267,
    schools: 14,
    hasImage: false,
  },
]

export default function ClassesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [className, setClassName] = useState('')
  const [classLogo, setClassLogo] = useState(null)

  const handleAddClass = () => {
    console.log('Adding class:', className, classLogo)
    setIsDialogOpen(false)
    setClassName('')
    setClassLogo(null)
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
                Create New Class
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classLogo">Class Logo</Label>
                <Input
                  id="classLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setClassLogo(e.target.files?.[0] || null)}
                />
                <p className="text-sm text-muted-foreground">
                  Upload an image for the class logo
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddClass} className="flex-1">
                  Create Class
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
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
                        Students
                      </span>
                    </div>
                    <Badge variant="secondary">{classItem.students}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Schools
                      </span>
                    </div>
                    <Badge variant="outline">{classItem.schools}</Badge>
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
