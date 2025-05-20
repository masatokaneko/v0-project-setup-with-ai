import { type NextRequest, NextResponse } from "next/server"
import { DealItemRepository } from "@/lib/repositories/deal-item-repository"
import { z } from "zod"

// 新規獲得契約アイテム作成スキーマ
const createDealItemSchema = z.object({
  dealId: z.string().min(1, "商談IDは必須です"),
  productId: z.string().min(1, "商品IDは必須です"),
  quantity: z.number().int().positive("数量は正の整数である必要があります"),
  unitPrice: z.number().positive("単価は正の数である必要があります"),
  taxRate: z.number().min(0, "税率は0以上である必要があります"),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
})

// 新規獲得契約アイテム一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get("dealId")

    let dealItems

    if (dealId) {
      dealItems = await DealItemRepository.findByDealId(dealId)
    } else {
      dealItems = await DealItemRepository.findAll()
    }

    return NextResponse.json(dealItems)
  } catch (error) {
    console.error("Error fetching deal items:", error)
    return NextResponse.json({ error: "新規獲得契約アイテムの取得中にエラーが発生しました" }, { status: 500 })
  }
}

// 新規獲得契約アイテム作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション
    const validatedData = createDealItemSchema.parse(body)

    // 新規獲得契約アイテムを作成
    const dealItem = await DealItemRepository.create(validatedData)

    return NextResponse.json(dealItem, { status: 201 })
  } catch (error) {
    console.error("Error creating deal item:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力データが不正です", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "新規獲得契約アイテムの作成中にエラーが発生しました" }, { status: 500 })
  }
}
