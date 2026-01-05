import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, AlertCircle, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

async function getDashboardStats() {
  const db = await getDatabase()
  const productsCollection = db.collection<Product>("products")

  const [totalProducts, activeProducts, outOfStock, totalRevenue] = await Promise.all([
    productsCollection.countDocuments(),
    productsCollection.countDocuments({ status: "active" }),
    productsCollection.countDocuments({ stock: 0 }),
    productsCollection
      .aggregate([
        { $match: { status: "active" } },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$price", { $ifNull: ["$sales", 0] }] } },
          },
        },
      ])
      .toArray(),
  ])

  return {
    totalProducts,
    activeProducts,
    outOfStock,
    totalRevenue: totalRevenue[0]?.total || 0,
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: `${stats.activeProducts} active products`,
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: "From all sales",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      icon: AlertCircle,
      description: "Products need restock",
      alert: stats.outOfStock > 0,
    },
    {
      title: "Active Products",
      value: stats.activeProducts,
      icon: TrendingUp,
      description: "Currently available",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your e-commerce store performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className={stat.alert ? "border-destructive/50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.alert ? "text-destructive" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.alert ? "text-destructive" : "text-muted-foreground"}`}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Create a new product listing with images and details</p>
            <Button asChild className="w-full">
              <Link href="/dashboard/products/new">
                Create Product
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Manage Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">View, edit, and delete existing products</p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">View Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Sales insights and inventory analytics</p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/analytics">
                View Analytics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
