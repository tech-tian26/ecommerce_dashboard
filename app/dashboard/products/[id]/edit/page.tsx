import { ObjectId } from "mongodb"
import { notFound } from "next/navigation"
import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/lib/types"
import { MultiStepForm } from "@/components/multi-step-form"

async function getProduct(id: string) {
  try {
    const db = await getDatabase()
    const productsCollection = db.collection<Product>("products")

    const product = await productsCollection.findOne({ _id: new ObjectId(id) })

    if (!product) {
      return null
    }

    return {
      ...product,
      _id: product._id?.toString(),
    }
  } catch (error) {
    return null
  }
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">Update product information</p>
      </div>

      <MultiStepForm initialData={product} productId={id} />
    </div>
  )
}
