import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await requireAdmin()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        bgRemovalCredits: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            imageDescriptions: true
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Admin users fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}