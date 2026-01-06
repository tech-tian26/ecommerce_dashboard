"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { productPricingSchema, type ProductPricingData } from "@/lib/validations"

interface ProductPricingFormProps {
  data: ProductPricingData
  onChange: (data: ProductPricingData) => void
  onNext: () => void
  onBack: () => void
}

export function ProductPricingForm({ data, onChange, onNext, onBack }: ProductPricingFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = productPricingSchema.safeParse(data)

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
        <Label htmlFor="price">Price (₹)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={data.price || ""}
          onChange={(e) => onChange({ ...data, price: Number.parseFloat(e.target.value) || 0 })}
          className={errors.price ? "border-destructive" : ""}
        />
        {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
        <Input
          id="sku"
          placeholder="e.g. WH-001"
          value={data.sku}
          onChange={(e) => onChange({ ...data, sku: e.target.value.toUpperCase() })}
          className={errors.sku ? "border-destructive" : ""}
        />
        {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock Quantity</Label>
        <Input
          id="stock"
          type="number"
          placeholder="0"
          value={data.stock || ""}
          onChange={(e) => onChange({ ...data, stock: Number.parseInt(e.target.value) || 0 })}
          className={errors.stock ? "border-destructive" : ""}
        />
        {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="submit">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}