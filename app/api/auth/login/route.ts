import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth"
import type { Admin } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const adminsCollection = db.collection<Admin>("admins")

    const admin = await adminsCollection.findOne({ email })

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, admin.password)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createToken({
      email: admin.email,
      id: admin._id!.toString(),
      role: admin.role,
    })

    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      admin: {
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
