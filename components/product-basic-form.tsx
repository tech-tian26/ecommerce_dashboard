"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import { productBasicSchema, type ProductBasicData } from "@/lib/validations"

interface ProductBasicFormProps {
  data: ProductBasicData
  onChange: (data: ProductBasicData) => void
  onNext: () => void
}

const categories = ["Electronics", "Furniture", "Accessories", "Clothing", "Home & Garden", "Sports", "Books", "Other"]

export function ProductBasicForm({ data, onChange, onNext }: ProductBasicFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = productBasicSchema.safeParse(data)

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
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          placeholder="e.g. Wireless Headphones"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your product in detail..."
          rows={4}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={data.category} onValueChange={(value) => onChange({ ...data, category: value })}>
          <SelectTrigger className={errors.category ? "border-destructive" : ""}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
