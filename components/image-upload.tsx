"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Loader2, ImagePlus } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) {
      setUploadError(`Maximum ${maxImages} images allowed`)
      return
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    setIsUploading(true)
    setUploadError(null)

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...images, ...uploadedUrls])
    } catch (error) {
      setUploadError("Failed to upload images. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">Product Images</label>
          <p className="text-sm text-muted-foreground">
            Upload up to {maxImages} images. First image will be the primary image.
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {images.length} / {maxImages}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative group overflow-hidden">
            <div className="aspect-square relative">
              <Image src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          </Card>
        ))}

        {images.length < maxImages && (
          <Card className="aspect-square">
            <label
              htmlFor="image-upload"
              className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </>
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                </>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </Card>
        )}
      </div>

      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
    </div>
  )
}
