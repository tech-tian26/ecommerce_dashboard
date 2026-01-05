"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProductBasicForm } from "./product-basic-form"
import { ProductPricingForm } from "./product-pricing-form"
import { ProductStatusForm } from "./product-status-form"
import { ImageUpload } from "./image-upload"
import type { ProductBasicData, ProductPricingData, ProductStatusData } from "@/lib/validations"

const steps = [
  { title: "Basic Info", description: "Product details" },
  { title: "Images", description: "Upload product images" },
  { title: "Pricing & Stock", description: "Set prices and inventory" },
  { title: "Status", description: "Product availability" },
]

interface MultiStepFormProps {
  initialData?: {
    name: string
    description: string
    category: string
    price: number
    sku: string
    stock: number
    status: "active" | "draft" | "archived"
    images: string[]
  }
  productId?: string
}

export function MultiStepForm({ initialData, productId }: MultiStepFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [basicData, setBasicData] = useState<ProductBasicData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
  })

  const [pricingData, setPricingData] = useState<ProductPricingData>({
    price: initialData?.price || 0,
    sku: initialData?.sku || "",
    stock: initialData?.stock || 0,
  })

  const [statusData, setStatusData] = useState<ProductStatusData>({
    status: initialData?.status || "draft",
  })

  const [images, setImages] = useState<string[]>(initialData?.images || [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const productData = {
        ...basicData,
        ...pricingData,
        ...statusData,
        images,
      }

      const url = productId ? `/api/products/${productId}` : "/api/products"
      const method = productId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        router.push("/dashboard/products")
        router.refresh()
      }
    } catch (error) {
      console.error("Submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{steps[currentStep].title}</h2>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </div>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>Fill in the required information for this step</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && <ProductBasicForm data={basicData} onChange={setBasicData} onNext={handleNext} />}
          {currentStep === 1 && (
            <div className="space-y-6">
              <ImageUpload images={images} onChange={setImages} />
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-left"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <ProductPricingForm data={pricingData} onChange={setPricingData} onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 3 && (
            <ProductStatusForm
              data={statusData}
              onChange={setStatusData}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
              isEditing={!!productId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
