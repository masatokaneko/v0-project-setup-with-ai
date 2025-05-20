import { type NextRequest, NextResponse } from "next/server"
import { DealRepository } from "@/lib/repositories/deal-repository"
import { z } from "zod"

// 商談更新スキーマ
const updateDealSchema = z.object({
  name: z.string().min(1, "商談名は必須です").optional(),
  customerId: z.string().min(1, "顧客IDは必須です").optional(),
  dealDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  status: z.enum(["OPEN", "WON", "LOST"]).optional(),
  description: z.string().optional(),
})

// 商談詳細取得
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deal = await DealRepository.findById(params.id)

    if (!deal) {
      return NextResponse.json({ error: "商談が見つかりません" }, { status: 404 })
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Error fetching deal:", error)
    return NextResponse.json({ error: "商談の取得中にエラーが発生しました" }, { status: 500 })
  }
}

// 商談更新
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // バリデーション
    const validatedData = updateDealSchema.parse(body)

    // 商談を更新
    const deal = await DealRepository.update({
      id: params.id,
      ...validatedData,
    })

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Error updating deal:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力データが不正です", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "商談の更新中にエラーが発生しました" }, { status: 500 })
  }
}

// 商談削除
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await DealRepository.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting deal:", error)
    return NextResponse.json({ error: "商談の削除中にエラーが発生しました" }, { status: 500 })
  }
}
