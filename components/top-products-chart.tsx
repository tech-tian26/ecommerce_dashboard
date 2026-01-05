"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TopProductsChartProps {
  data: Array<{
    name: string
    sales: number
    revenue: number
  }>
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <ChartContainer
      config={{
        sales: {
          label: "Sales",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="sales" fill="var(--color-sales)" radius={[0, 4, 4, 0]} name="Sales" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
