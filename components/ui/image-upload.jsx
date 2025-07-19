'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function ImageUpload({
  value = '',
  onChange,
  label = 'Upload Image',
  placeholder = 'Click to upload image',
  disabled = false,
  className = '',
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(value)
  const fileInputRef = useRef(null)

  // Update preview when value prop changes (for edit scenarios)
  useEffect(() => {
    setPreview(value)
  }, [value])

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type - support more image formats including WebP
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, WebP, SVG)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      console.log(
        'Uploading file:',
        file.name,
        'Size:',
        file.size,
        'Type:',
        file.type
      )

      // Use upload preset instead of signed upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'presentsir') // Use the existing upload preset
      formData.append('folder', 'subjects')

      console.log('Uploading to Cloudinary with preset...')

      // Upload to Cloudinary using upload preset
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/doxmvuss9/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      console.log('Upload response status:', response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Upload failed:', errorData)

        // Try to parse error message from Cloudinary
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`
        try {
          const errorJson = JSON.parse(errorData)
          if (errorJson.error?.message) {
            errorMessage = errorJson.error.message
          }
        } catch (e) {
          // If parsing fails, use the raw error data
          if (errorData) {
            errorMessage = errorData
          }
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Upload success:', data)

      if (!data.secure_url) {
        throw new Error('No secure URL received from Cloudinary')
      }

      const imageUrl = data.secure_url
      setPreview(imageUrl)
      onChange(imageUrl)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)

      // Provide more specific error messages
      let userMessage = 'Failed to upload image. Please try again.'
      if (error.message.includes('upload_preset')) {
        userMessage =
          'Upload preset not configured. Please contact administrator.'
      } else if (error.message.includes('413')) {
        userMessage = 'File too large. Please select a smaller image.'
      } else if (error.message.includes('400')) {
        userMessage = 'Invalid file format. Please select a valid image.'
      } else {
        userMessage = `Upload failed: ${error.message}`
      }

      toast.error(userMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>

      <div className="space-y-3">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {/* Upload Area */}
        {!preview ? (
          <div
            onClick={handleClick}
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-colors duration-200 hover:border-primary/50 hover:bg-primary/5
              ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="space-y-2">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isUploading ? 'Uploading...' : placeholder}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, GIF, WebP, SVG up to 5MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Area */
          <div className="relative">
            <div className="relative h-32 w-full rounded-lg overflow-hidden border">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="absolute top-2 right-2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Upload Button (when no preview) */}
        {!preview && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Image
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
