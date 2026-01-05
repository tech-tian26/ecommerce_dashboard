"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { productStatusSchema, type ProductStatusData } from "@/lib/validations"

interface ProductStatusFormProps {
  data: ProductStatusData
  onChange: (data: ProductStatusData) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
  isEditing: boolean
}

const statusOptions = [
  {
    value: "active",
    label: "Active",
    description: "Product is visible and available for purchase",
  },
  {
    value: "draft",
    label: "Draft",
    description: "Product is not visible to customers",
  },
  {
    value: "archived",
    label: "Archived",
    description: "Product is no longer available",
  },
] as const

export function ProductStatusForm({
  data,
  onChange,
  onSubmit,
  onBack,
  isSubmitting,
  isEditing,
}: ProductStatusFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = productStatusSchema.safeParse(data)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0].toString()] = error.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Product Status</Label>
        <RadioGroup value={data.status} onValueChange={(value) => onChange({ ...data, status: value as any })}>
          {statusOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 space-y-0 p-4 border border-border rounded-lg"
            >
              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={option.value} className="font-medium cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
        {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {isEditing ? "Update Product" : "Create Product"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
