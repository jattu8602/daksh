'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ChevronLeft, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-8 h-8 cursor-pointer ${
            rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  )
}

const ReviewDialog = ({ open, onOpenChange, onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await onSubmit({ rating, description })
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience and help us improve.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <Textarea
            placeholder="Tell us what you think..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || !description || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TalkToFounderScreen() {
  const [selectedOption, setSelectedOption] = useState('')
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const router = useRouter()
  const { user } = useSelector((state) => state.auth)

  const handleReviewSubmit = async ({ rating, description }) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, description }),
      })

      if (response.ok) {
        toast.success('Thank you for your review!')
        setIsReviewDialogOpen(false)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to submit review.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred.')
    }
  }

  const handleAction = () => {
    const studentUniqueCode = user?.username || 'Not-Logged-In'
    const source = 'talk_to_founder'
    const number = '+919691929907'

    switch (selectedOption) {
      case 'report':
        window.location.href = `tel:${number}`
        break
      case 'idea': {
        const message = `Student Unique Code: ${studentUniqueCode}\nSource: ${source}\n\nPlease share your feedback or idea below:\n-------------------------------------\n`
        const encodedMessage = encodeURIComponent(message)
        window.open(
          `https://wa.me/919691929907?text=${encodedMessage}`,
          '_blank'
        )
        break
      }
      case 'appreciate':
        setIsReviewDialogOpen(true)
        break
      default:
        break
    }
  }

  const getButtonText = () => {
    switch (selectedOption) {
      case 'report':
        return 'Talk to me'
      case 'idea':
        return 'Send a message'
      case 'appreciate':
        return 'Leave a review'
      default:
        return 'Select an option'
    }
  }

  const getButtonDisabled = () => {
    return selectedOption === ''
  }

  return (
    <>
      <ReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        onSubmit={handleReviewSubmit}
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="bg-card p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-lg font-semibold">TALK TO THE FOUNDER</h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card p-6">
          {/* Founder Profile */}
          <div className="flex items-start gap-4 mb-8">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/doxmvuss9/image/upload/v1750277816/link-generator/hr4rox9v0oxwzojclsxt.jpg"
                alt="Kabir Jaiswal"
                className="w-30 h-30 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">Kabir Jaiswal</h2>
              <p className="text-muted-foreground mb-3">Founder of Daksh</p>
              <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm inline-block">
                Hey how can I help you today?
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <Label
                  htmlFor="report"
                  className="flex-1 cursor-pointer font-medium"
                >
                  Report a problem
                </Label>
                <RadioGroupItem
                  value="report"
                  id="report"
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <Label
                  htmlFor="idea"
                  className="flex-1 cursor-pointer font-medium"
                >
                  Share an idea
                </Label>
                <RadioGroupItem value="idea" id="idea" className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <Label
                  htmlFor="appreciate"
                  className="flex-1 cursor-pointer font-medium"
                >
                  Appreciate the Team
                </Label>
                <RadioGroupItem
                  value="appreciate"
                  id="appreciate"
                  className="w-5 h-5"
                />
              </div>
            </RadioGroup>
          </div>

          {/* Action Button */}
          <Button
            className="w-full py-4 rounded-xl text-lg font-medium"
            disabled={getButtonDisabled()}
            onClick={handleAction}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </>
  )
}
