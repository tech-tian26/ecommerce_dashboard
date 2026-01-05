import { z } from "zod"

export const productBasicSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters").max(100, "Product name is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
  category: z.string().min(1, "Category is required"),
})

export const productPricingSchema = z.object({
  price: z.number().min(0.01, "Price must be greater than 0"),
  sku: z.string().min(3, "SKU must be at least 3 characters").max(50, "SKU is too long"),
  stock: z.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
})

export const productStatusSchema = z.object({
  status: z.enum(["active", "draft", "archived"], {
    required_error: "Status is required",
  }),
})

export const fullProductSchema = productBasicSchema.merge(productPricingSchema).merge(productStatusSchema)

export type ProductBasicData = z.infer<typeof productBasicSchema>
export type ProductPricingData = z.infer<typeof productPricingSchema>
export type ProductStatusData = z.infer<typeof productStatusSchema>
export type FullProductData = z.infer<typeof fullProductSchema>
