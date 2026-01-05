"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SalesChartProps {
  data: Array<{
    month: string
    sales: number
    revenue: number
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ChartContainer
      config={{
        sales: {
          label: "Sales",
          color: "hsl(var(--chart-1))",
        },
        revenue: {
          label: "Revenue",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} name="Sales" />
          <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} name="Revenue ($)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
