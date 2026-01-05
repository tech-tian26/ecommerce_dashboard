import { MultiStepForm } from "@/components/multi-step-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Product</h1>
        <p className="text-muted-foreground">Add a new product to your catalog</p>
      </div>

      <MultiStepForm />
    </div>
  )
}
