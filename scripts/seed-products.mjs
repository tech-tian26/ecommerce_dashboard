import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)


async function seedProducts() {
  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db('ecommerce_admin')
    const productsCollection = db.collection('products')

    // Clear existing products
    await productsCollection.deleteMany({})

    // Sample products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        price: 299.99,
        category: 'Electronics',
        stock: 45,
        images: ['/placeholder.svg?height=400&width=400'],
        sku: 'WH-001',
        status: 'active',
        sales: 124,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking with heart rate monitor and GPS',
        price: 399.99,
        category: 'Electronics',
        stock: 28,
        images: ['/placeholder.svg?height=400&width=400'],
        sku: 'SW-002',
        status: 'active',
        sales: 89,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date(),
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Premium mesh office chair with lumbar support and adjustable armrests',
        price: 449.99,
        category: 'Furniture',
        stock: 15,
        images: ['/placeholder.svg?height=400&width=400'],
        sku: 'CH-003',
        status: 'active',
        sales: 56,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date(),
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard with blue switches',
        price: 129.99,
        category: 'Electronics',
        stock: 67,
        images: ['/placeholder.svg?height=400&width=400'],
        sku: 'KB-004',
        status: 'active',
        sales: 203,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date(),
      },
      {
        name: 'Standing Desk',
        description: 'Electric height-adjustable standing desk with memory presets',
        price: 599.99,
        category: 'Furniture',
        stock: 8,
        images: ['/placeholder.svg?height=400&width=400'],
        sku: 'DS-005',
        status: 'active',
        sales: 34,
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date(),
      },
      {
        name: 'Laptop Stand',
        description: 'Aluminum laptop stand with adjustable height and angle',
        price: 49.99,
        category: 'Accessories',
        stock: 120,
        images: ['/placeholder.svg?height=400&width=400'],
        sku: 'LS-006',
        status: 'active',
        sales: 178,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date(),
      },
      {
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
        price: 79.99,
        category: 'Accessories',
        stock: 0,
        images: ['/placeholder.svg?height=400&width=400'],
        sku: 'UH-007',
        status: 'active',
        sales: 145,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date(),
      },
      {
        name: 'Monitor Light Bar',
        description: 'LED monitor light bar with auto-dimming and color temperature adjustment',
        price: 89.99,
        category: 'Accessories',
        stock: 42,
        images: ['/placeholder.svg?height=400&width=400'],
        sku: 'ML-008',
        status: 'draft',
        sales: 67,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date(),
      },
    ]

    await productsCollection.insertMany(products)

    console.log(`${products.length} products seeded successfully`)

  } catch (error) {
    console.error('Error seeding products:', error)
  } finally {
    await client.close()
  }
}

seedProducts()
