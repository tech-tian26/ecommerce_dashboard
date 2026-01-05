import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/lib/types"
import { requireAuth } from "@/lib/auth"
import { fullProductSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  const auth = await requireAuth()

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const db = await getDatabase()
    const productsCollection = db.collection<Product>("products")

    const products = await productsCollection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth()

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    const result = fullProductSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 })
    }

    const db = await getDatabase()
    const productsCollection = db.collection<Product>("products")

    const newProduct: Product = {
      ...result.data,
      images: body.images || [],
      sales: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await productsCollection.insertOne(newProduct)

    return NextResponse.json({ success: true, productId: insertResult.insertedId })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
