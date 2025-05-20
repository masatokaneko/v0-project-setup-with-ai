import { type NextRequest, NextResponse } from "next/server"
import { CostRepository } from "@/lib/repositories/cost-repository"
import { z } from "zod"

// 費用作成スキーマ
const createCostSchema = z.object({
  year: z.number().int().positive("年は正の整数である必要があります"),
  month: z.number().int().min(1, "月は1以上である必要があります").max(12, "月は12以下である必要があります"),
  type: z.enum(["COGS", "SGA"]),
  category: z.string().min(1, "カテゴリは必須です"),
  amount: z.number().positive("金額は正の数である必要があります"),
  description: z.string().optional(),
})

// 費用更新スキーマ
const updateCostSchema = z.object({
  type: z.enum(["COGS", "SGA"]).optional(),
  category: z.string().min(1, "カテゴリは必須です").optional(),
  amount: z.number().positive("金額は正の数である必要があります").optional(),
  description: z.string().optional(),
})

// 費用データ取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year")
    const month = searchParams.get("month")
    const fiscalYear = searchParams.get("fiscalYear")
    const fiscalQuarter = searchParams.get("fiscalQuarter")
    const startYear = searchParams.get("startYear")
    const startMonth = searchParams.get("startMonth")
    const endYear = searchParams.get("endYear")
    const endMonth = searchParams.get("endMonth")

    // 特定の年月の費用を取得
    if (year && month) {
      const cost = await CostRepository.getCostByYearMonth(Number(year), Number(month))
      return NextResponse.json(cost)
    }

    // 会計年度の費用を取得
    if (fiscalYear) {
      // 会計四半期が指定されている場合
      if (fiscalQuarter) {
        const cost = await CostRepository.getCostByFiscalQuarter(Number(fiscalYear), Number(fiscalQuarter))
        return NextResponse.json(cost)
      }

      // 会計年度全体の費用を取得
      const cost = await CostRepository.getCostByFiscalYear(Number(fiscalYear))
      return NextResponse.json(cost)
    }

    // 期間の費用を取得
    if (startYear && startMonth && endYear && endMonth) {
      const cost = await CostRepository.getCostByPeriod(
        Number(startYear),
        Number(startMonth),
        Number(endYear),
        Number(endMonth),
      )
      return NextResponse.json(cost)
    }

    // パラメータが不足している場合
    return NextResponse.json({ error: "必要なパラメータが不足しています" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching cost:", error)
    return NextResponse.json({ error: "費用データの取得中にエラーが発生しました" }, { status: 500 })
  }
}

// 費用作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション
    const validatedData = createCostSchema.parse(body)

    // 費用を作成
    const cost = await CostRepository.create(validatedData)

    return NextResponse.json(cost, { status: 201 })
  } catch (error) {
    console.error("Error creating cost:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力データが不正です", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "費用の作成中にエラーが発生しました" }, { status: 500 })
  }
}

// 費用更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 })
    }

    // バリデーション
    const validatedData = updateCostSchema.parse(updateData)

    // 費用を更新
    const cost = await CostRepository.update({
      id,
      ...validatedData,
    })

    return NextResponse.json(cost)
  } catch (error) {
    console.error("Error updating cost:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力データが不正です", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "費用の更新中にエラーが発生しました" }, { status: 500 })
  }
}

// 費用削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 })
    }

    await CostRepository.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting cost:", error)
    return NextResponse.json({ error: "費用の削除中にエラーが発生しました" }, { status: 500 })
  }
}
