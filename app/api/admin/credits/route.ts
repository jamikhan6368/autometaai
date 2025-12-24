import { NextRequest, NextResponse } from "next/server"
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

    const transactions = await prisma.creditTransaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 100 // Limit to last 100 transactions
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Admin credits fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { userId, amount, creditType, description } = await request.json()

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "User ID and amount are required" },
        { status: 400 }
      )
    }

    // Determine which credit field to update based on creditType
    const isBgCredit = creditType === "bg"

    // Update user credits - using 'any' type as bgRemovalCredits may not be in types yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = isBgCredit
      ? { bgRemovalCredits: { increment: amount } }
      : { credits: { increment: amount } }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    // Create credit transaction
    await prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type: "ADMIN_ADJUSTMENT",
        description: description || `Admin ${isBgCredit ? "BG removal" : "general"} credit adjustment`
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedUserAny = updatedUser as any

    return NextResponse.json({
      message: "Credits added successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        credits: updatedUser.credits,
        bgRemovalCredits: updatedUserAny.bgRemovalCredits || 0
      }
    })
  } catch (error) {
    console.error("Admin credits add error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}