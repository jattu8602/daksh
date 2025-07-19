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
  Upload,
  Camera,
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

export default function ClassDetailPage() {
  const params = useParams()
  const classId = params.classId

  const [classData, setClassData] = useState(null)
  const [boards, setBoards] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Add board state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [boardName, setBoardName] = useState('')
  const [boardCode, setBoardCode] = useState('')
  const [boardDescription, setBoardDescription] = useState('')
  const [isAddLoading, setIsAddLoading] = useState(false)

  // Edit board state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState(null)
  const [editBoardName, setEditBoardName] = useState('')
  const [editBoardCode, setEditBoardCode] = useState('')
  const [editBoardDescription, setEditBoardDescription] = useState('')
  const [isEditLoading, setIsEditLoading] = useState(false)

  // Delete board state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingBoard, setDeletingBoard] = useState(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  // Fetch class data and boards
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch class data
        const classResponse = await fetch(`/api/classes/${classId}`)
        const classResult = await classResponse.json()

        if (!classResponse.ok) {
          throw new Error(classResult.error || 'Failed to fetch class data')
        }

        if (classResult.success) {
          setClassData(classResult.class)
        } else {
          throw new Error(classResult.error || 'Failed to fetch class data')
        }

        // Fetch boards for this class
        const boardsResponse = await fetch(`/api/boards?classId=${classId}`)
        const boardsResult = await boardsResponse.json()

        if (!boardsResponse.ok) {
          throw new Error(boardsResult.error || 'Failed to fetch boards')
        }

        if (boardsResult.success) {
          setBoards(boardsResult.boards)
        } else {
          throw new Error(boardsResult.error || 'Failed to fetch boards')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error(error.message || 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    if (classId) {
      fetchData()
    }
  }, [classId])

  const handleAddBoard = async () => {
    if (!boardName.trim() || !boardCode.trim()) {
      toast.error('Please enter board name and code')
      return
    }

    setIsAddLoading(true)
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: boardName.trim(),
          code: boardCode.trim(),
          description: boardDescription.trim(),
          classId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create board')
      }

      setBoards((prev) => [...prev, data.board])
      toast.success('Board created successfully')
      setIsAddDialogOpen(false)
      setBoardName('')
      setBoardCode('')
      setBoardDescription('')
    } catch (error) {
      toast.error(error.message || 'Failed to create board')
      console.error('Error creating board:', error)
    } finally {
      setIsAddLoading(false)
    }
  }

  const handleEditBoard = (board) => {
    setEditingBoard(board)
    setEditBoardName(board.name)
    setEditBoardCode(board.code)
    setEditBoardDescription(board.description || '')
    setIsEditDialogOpen(true)
  }

  const handleUpdateBoard = async () => {
    if (!editBoardName.trim() || !editBoardCode.trim()) {
      toast.error('Please enter board name and code')
      return
    }

    setIsEditLoading(true)
    try {
      const response = await fetch(`/api/boards/${editingBoard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editBoardName.trim(),
          code: editBoardCode.trim(),
          description: editBoardDescription.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update board')
      }

      setBoards((prev) =>
        prev.map((board) =>
          board.id === editingBoard.id ? { ...board, ...data.board } : board
        )
      )
      toast.success('Board updated successfully')
      setIsEditDialogOpen(false)
      setEditingBoard(null)
      setEditBoardName('')
      setEditBoardCode('')
      setEditBoardDescription('')
    } catch (error) {
      toast.error(error.message || 'Failed to update board')
      console.error('Error updating board:', error)
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleDeleteBoard = (board) => {
    setDeletingBoard(board)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleteLoading(true)
    try {
      const response = await fetch(`/api/boards/${deletingBoard.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete board')
      }

      setBoards((prev) => prev.filter((board) => board.id !== deletingBoard.id))
      toast.success('Board deleted successfully')
      setIsDeleteDialogOpen(false)
      setDeletingBoard(null)
    } catch (error) {
      toast.error(error.message || 'Failed to delete board')
      console.error('Error deleting board:', error)
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

  if (!classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Class not found</h1>
          <p className="text-muted-foreground">
            The requested class could not be found.
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
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">{classData.name}</h1>
              <Badge variant="outline">Global Template</Badge>
            </div>
            <p className="text-muted-foreground">
              Manage boards and educational content for this global class
              template. All schools using this template will inherit these
              boards and subjects.
            </p>
          </div>
        </div>

        {/* Class Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold">
                    {classData.totalStudents || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Boards</p>
                  <p className="text-2xl font-bold">{boards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    School Instances
                  </p>
                  <p className="text-2xl font-bold">
                    {classData._count?.schoolClasses || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Board Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Boards</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Board
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Board
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="boardName">Board Name</Label>
                <Input
                  id="boardName"
                  placeholder="e.g., NCERT, CBSE, ICSE"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  disabled={isAddLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="boardCode">Board Code</Label>
                <Input
                  id="boardCode"
                  placeholder="e.g., ncert, cbse, icse"
                  value={boardCode}
                  onChange={(e) => setBoardCode(e.target.value)}
                  disabled={isAddLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="boardDescription">Description (Optional)</Label>
                <Textarea
                  id="boardDescription"
                  placeholder="Brief description of the board"
                  value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}
                  disabled={isAddLoading}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddBoard}
                  className="flex-1"
                  disabled={isAddLoading}
                >
                  {isAddLoading ? 'Creating...' : 'Create Board'}
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

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board) => (
          <Card
            key={board.id}
            className="hover:shadow-lg transition-shadow group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Link
                  href={`/admin/class/${classId}/${board.id}`}
                  className="flex-1"
                >
                  <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer">
                    {board.name}
                  </CardTitle>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditBoard(board)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteBoard(board)}
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
              {board.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {board.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Subjects</p>
                    <p className="text-sm font-semibold">
                      {board._count?.subjects || 0}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {board.code.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {boards.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding boards for this class
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Board
          </Button>
        </div>
      )}

      {/* Edit Board Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              Edit Board
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="editBoardName">Board Name</Label>
              <Input
                id="editBoardName"
                placeholder="e.g., NCERT, CBSE, ICSE"
                value={editBoardName}
                onChange={(e) => setEditBoardName(e.target.value)}
                disabled={isEditLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editBoardCode">Board Code</Label>
              <Input
                id="editBoardCode"
                placeholder="e.g., ncert, cbse, icse"
                value={editBoardCode}
                onChange={(e) => setEditBoardCode(e.target.value)}
                disabled={isEditLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editBoardDescription">
                Description (Optional)
              </Label>
              <Textarea
                id="editBoardDescription"
                placeholder="Brief description of the board"
                value={editBoardDescription}
                onChange={(e) => setEditBoardDescription(e.target.value)}
                disabled={isEditLoading}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleUpdateBoard}
                className="flex-1"
                disabled={isEditLoading}
              >
                {isEditLoading ? 'Updating...' : 'Update Board'}
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

      {/* Delete Board Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the board "{deletingBoard?.name}" and all its
              associated subjects and content. This action cannot be undone.
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
