export interface Admin {
  _id?: string
  email: string
  password: string
  role: "admin"
  createdAt: Date
}

export interface Product {
  _id?: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  sku: string
  status: "active" | "draft" | "archived"
  sales?: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  stock: number
  sku: string
  status: "active" | "draft" | "archived"
}
