import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function seedAdmin() {
  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db('ecommerce_admin')
    const adminsCollection = db.collection('admins')

    // Check if demo admin already exists
    const existingAdmin = await adminsCollection.findOne({ email: 'admin@demo.com' })

    if (existingAdmin) {
      console.log('Demo admin already exists')
      return
    }

    // Create demo admin
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    await adminsCollection.insertOne({
      email: 'admin@demo.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    })

    console.log('Demo admin created successfully')
    console.log('Email: admin@demo.com')
    console.log('Password: admin123')

  } catch (error) {
    console.error('Error seeding admin:', error)
  } finally {
    await client.close()
  }
}

seedAdmin()
