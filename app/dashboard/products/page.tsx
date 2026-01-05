import Link from "next/link"
import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ProductsTable } from "@/components/products-table"

async function getProducts() {
  const db = await getDatabase()
  const productsCollection = db.collection<Product>("products")

  const products = await productsCollection.find({}).sort({ createdAt: -1 }).toArray()

  return products.map((product) => ({
    ...product,
    _id: product._id?.toString(),
  }))
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsTable products={products} />
        </CardContent>
      </Card>
    </div>
  )
}
