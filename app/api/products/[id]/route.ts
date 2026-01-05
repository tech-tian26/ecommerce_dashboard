import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/lib/types"
import { requireAuth } from "@/lib/auth"
import { fullProductSchema } from "@/lib/validations"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth()

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const db = await getDatabase()
    const productsCollection = db.collection<Product>("products")

    const product = await productsCollection.findOne({ _id: new ObjectId(id) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth()

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const db = await getDatabase()
    const productsCollection = db.collection<Product>("products")

    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Product delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest,{ params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth()

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    const result = fullProductSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 })
    }

    const db = await getDatabase()
    const productsCollection = db.collection<Product>("products")

    const updateData = {
      ...result.data,
      images: body.images || [],
      updatedAt: new Date(),
    }

    const updateResult = await productsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
