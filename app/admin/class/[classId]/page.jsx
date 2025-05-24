'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Video,
  Headphones,
  Zap,
  FileText,
  GraduationCap,
  Palette,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    id: 'books',
    name: 'Books',
    icon: BookOpen,
    description: 'Digital textbooks and reading materials',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: Video,
    description: 'Educational video content and lectures',
    color: 'bg-red-100 text-red-700',
  },
  {
    id: 'audiobooks',
    name: 'Audiobooks',
    icon: Headphones,
    description: 'Audio narrated books and stories',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'shots',
    name: 'Shots',
    icon: Zap,
    description: 'Quick learning snippets and summaries',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 'docs',
    name: 'Documents',
    icon: FileText,
    description: 'Study materials and documentation',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'ncert',
    name: 'NCERT',
    icon: GraduationCap,
    description: 'NCERT curriculum and resources',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'creatives',
    name: 'Creatives',
    icon: Palette,
    description: 'Creative projects and activities',
    color: 'bg-pink-100 text-pink-700',
  },
]

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.classId

  const handleCategorySelect = (categoryId) => {
    router.push(`/admin/class/${classId}/${categoryId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/class">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold capitalize">
            {classId} Class Resources
          </h1>
          <Badge variant="outline" className="text-lg px-3 py-1">
            Class {classId}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-6">
          Choose a category to access educational content for {classId} class
          students.
        </p>

        <div className="mb-8">
          <Select onValueChange={handleCategorySelect}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Quick select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {category.name}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Card
              key={category.id}
              className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Access {category.name}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
