'use client'

import { useState } from 'react'
import Image from 'next/image'
import { uploadFile, deleteFile } from '@/process/actions/fileUploadAction'
import { MAX_FILE_SIZE } from '@/utils/consts'
import { getImagePath } from '@/utils/getImagePath'

interface HeroImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string | null
  className?: string
}

export const HeroImageUpload = ({
  onUpload,
  currentImage,
  className = '',
}: HeroImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const [error, setError] = useState<string>('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear previous errors
    setError('')

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image size must be less than 1MB')
      return
    }

    try {
      setIsUploading(true)
      const response = await uploadFile(file, 'hero')

      if (response.success && response.data) {
        // If there's an existing image, delete it
        if (preview) {
          await deleteFile(preview)
        }
        setPreview(response.data.url)
        onUpload(response.data.url)
      } else {
        setError(response.message || 'Upload failed')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!preview) return

    try {
      await deleteFile(preview)
      setPreview(undefined)
      onUpload('')
    } catch (error) {
      console.error('Failed to remove image:', error)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {error && <div className="text-danger text-sm">{error}</div>}
      {preview ? (
        <div className="relative">
          <div className="relative max-w-4xl mx-auto">
            <Image
              src={getImagePath(preview)}
              alt="Hero image preview"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <div
              className="material-symbols-rounded cursor-pointer bg-danger rounded-md p-1"
              onClick={handleRemove}
            >
              delete
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
          <label className="cursor-pointer block">
            <input
              id="heroImage"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <div className="space-y-2">
              <div className="text-lg font-medium">
                {isUploading ? 'Uploading...' : 'Upload Hero Image'}
              </div>
              <div className="text-sm text-subtext">
                Drop an image here or click to upload
              </div>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}
