'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Upload,
  Plus,
  Search,
  Filter,
  BookOpen,
  Video,
  Headphones,
  Zap,
  FileText,
  GraduationCap,
  Palette,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const categoryIcons = {
  books: BookOpen,
  videos: Video,
  audiobooks: Headphones,
  shots: Zap,
  docs: FileText,
  ncert: GraduationCap,
  creatives: Palette,
}

const sampleContent = {
  books: [
    {
      id: 1,
      title: 'Mathematics Textbook',
      author: 'NCERT',
      size: '15.2 MB',
      type: 'PDF',
    },
    {
      id: 2,
      title: 'Science Workbook',
      author: 'State Board',
      size: '22.1 MB',
      type: 'PDF',
    },
    {
      id: 3,
      title: 'English Literature',
      author: 'Oxford',
      size: '18.7 MB',
      type: 'PDF',
    },
  ],
  videos: [
    {
      id: 1,
      title: 'Introduction to Algebra',
      duration: '25:30',
      views: '1.2k',
      type: 'MP4',
    },
    {
      id: 2,
      title: 'Science Experiments',
      duration: '18:45',
      views: '856',
      type: 'MP4',
    },
    {
      id: 3,
      title: 'English Grammar Basics',
      duration: '32:15',
      views: '2.1k',
      type: 'MP4',
    },
  ],
  audiobooks: [
    {
      id: 1,
      title: 'Story Time Collection',
      duration: '2h 15m',
      narrator: 'Sarah Johnson',
      type: 'MP3',
    },
    {
      id: 2,
      title: 'History Tales',
      duration: '1h 45m',
      narrator: 'Mike Davis',
      type: 'MP3',
    },
  ],
}

export default function CategoryPage() {
  const params = useParams()
  const classId = params.classId
  const category = params.category
  const [showUpload, setShowUpload] = useState(false)

  const CategoryIcon = categoryIcons[category] || BookOpen
  const content = sampleContent[category] || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/admin/class/${classId}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {classId} Class
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CategoryIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold capitalize">{category}</h1>
            <Badge variant="outline">Class {classId}</Badge>
          </div>

          <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Content
          </Button>
        </div>
      </div>

      {showUpload && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Upload New {category.slice(0, -1)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder={`Enter ${category.slice(0, -1)} title`}
                />
              </div>
              <div>
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter description..." />
            </div>
            <div className="flex gap-2">
              <Button>Upload</Button>
              <Button variant="outline" onClick={() => setShowUpload(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={`Search ${category}...`} className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  )
}
