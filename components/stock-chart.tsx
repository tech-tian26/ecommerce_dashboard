"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StockChartProps {
  data: Array<{
    category: string
    stock: number
  }>
}

export function StockChart({ data }: StockChartProps) {
  return (
    <ChartContainer
      config={{
        stock: {
          label: "Stock",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="stock" fill="#ffff00" radius={[4, 4, 0, 0]} name="Stock Units" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
