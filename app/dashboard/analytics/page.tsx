import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesChart } from "@/components/sales-chart"
import { StockChart } from "@/components/stock-chart"
import { CategoryChart } from "@/components/category-chart"
import { TopProductsChart } from "@/components/top-products-chart"

async function getAnalyticsData() {
  const db = await getDatabase()
  const productsCollection = db.collection<Product>("products")

  const products = await productsCollection.find({ status: "active" }).toArray()

  // Calculate sales by category
  const salesByCategory = products.reduce(
    (acc, product) => {
      const category = product.category
      const sales = (product.sales || 0) * product.price
      acc[category] = (acc[category] || 0) + sales
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate stock by category
  const stockByCategory = products.reduce(
    (acc, product) => {
      const category = product.category
      acc[category] = (acc[category] || 0) + product.stock
      return acc
    },
    {} as Record<string, number>,
  )

  // Get top selling products
  const topProducts = products
    .filter((p) => p.sales && p.sales > 0)
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      sales: p.sales || 0,
      revenue: (p.sales || 0) * p.price,
    }))

  // Simulate monthly sales data for the chart
  const monthlySales = [
    { month: "Jan", sales: 4200, revenue: 12500 },
    { month: "Feb", sales: 5100, revenue: 15800 },
    { month: "Mar", sales: 4800, revenue: 14200 },
    { month: "Apr", sales: 6200, revenue: 18500 },
    { month: "May", sales: 5900, revenue: 17800 },
    { month: "Jun", sales: 7100, revenue: 21200 },
  ]

  return {
    salesByCategory: Object.entries(salesByCategory).map(([category, sales]) => ({
      category,
      sales,
    })),
    stockByCategory: Object.entries(stockByCategory).map(([category, stock]) => ({
      category,
      stock,
    })),
    topProducts,
    monthlySales,
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Sales and inventory insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Overview</CardTitle>
            <CardDescription>Sales and revenue trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={data.monthlySales} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock by Category</CardTitle>
            <CardDescription>Current inventory levels across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <StockChart data={data.stockByCategory} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={data.salesByCategory} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProductsChart data={data.topProducts} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
