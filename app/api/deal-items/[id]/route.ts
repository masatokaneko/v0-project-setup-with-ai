import { type NextRequest, NextResponse } from "next/server"
import { DealItemRepository } from "@/lib/repositories/deal-item-repository"
import { z } from "zod"

// 新規獲得契約アイテム更新スキーマ
const updateDealItemSchema = z.object({
  productId: z.string().min(1, "商品IDは必須です").optional(),
  quantity: z.number().int().positive("数量は正の整数である必要があります").optional(),
  unitPrice: z.number().positive("単価は正の数である必要があります").optional(),
  taxRate: z.number().min(0, "税率は0以上である必要があります").optional(),
  startDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
})

// 新規獲得契約アイテム詳細取得
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dealItem = await DealItemRepository.findById(params.id)

    if (!dealItem) {
      return NextResponse.json({ error: "新規獲得契約アイテムが見つかりません" }, { status: 404 })
    }

    return NextResponse.json(dealItem)
  } catch (error) {
    console.error("Error fetching deal item:", error)
    return NextResponse.json({ error: "新規獲得契約アイテムの取得中にエラーが発生しました" }, { status: 500 })
  }
}

// 新規獲得契約アイテム更新
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // バリデーション
    const validatedData = updateDealItemSchema.parse(body)

    // 新規獲得契約アイテムを更新
    const dealItem = await DealItemRepository.update({
      id: params.id,
      ...validatedData,
    })

    return NextResponse.json(dealItem)
  } catch (error) {
    console.error("Error updating deal item:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力データが不正です", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "新規獲得契約アイテムの更新中にエラーが発生しました" }, { status: 500 })
  }
}

// 新規獲得契約アイテム削除
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await DealItemRepository.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting deal item:", error)
    return NextResponse.json({ error: "新規獲得契約アイテムの削除中にエラーが発生しました" }, { status: 500 })
  }
}
