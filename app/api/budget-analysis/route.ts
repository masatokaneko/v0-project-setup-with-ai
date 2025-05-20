import { type NextRequest, NextResponse } from "next/server"
import { BudgetRepository } from "@/lib/repositories/budget-repository"
import { z } from "zod"

// 予算作成スキーマ
const createBudgetSchema = z.object({
  year: z.number().int().positive("年は正の整数である必要があります"),
  month: z.number().int().min(1, "月は1以上である必要があります").max(12, "月は12以下である必要があります"),
  type: z.enum(["DEAL_ACQUISITION", "REVENUE", "COGS", "SGA", "PROFIT"]),
  category: z.string().optional(),
  amount: z.number().positive("金額は正の数である必要があります"),
  description: z.string().optional(),
})

// 予算更新スキーマ
const updateBudgetSchema = z.object({
  amount: z.number().positive("金額は正の数である必要があります").optional(),
  description: z.string().optional(),
})

// 予実分析データ取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year")
    const month = searchParams.get("month")
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const fiscalYear = searchParams.get("fiscalYear")
    const fiscalQuarter = searchParams.get("fiscalQuarter")

    if (!type) {
      return NextResponse.json({ error: "予算タイプは必須です" }, { status: 400 })
    }

    // 特定の年月の予実分析を取得
    if (year && month) {
      const analysis = await BudgetRepository.getBudgetAnalysis(
        Number(year),
        Number(month),
        type as any,
        category || undefined,
      )
      return NextResponse.json(analysis)
    }

    // 会計年度の予実分析を取得
    if (fiscalYear) {
      // 会計四半期が指定されている場合
      if (fiscalQuarter) {
        const analysis = await BudgetRepository.getBudgetAnalysisByFiscalQuarter(
          Number(fiscalYear),
          Number(fiscalQuarter),
          type as any,
          category || undefined,
        )
        return NextResponse.json(analysis)
      }

      // 会計年度全体の予実分析を取得
      const analysis = await BudgetRepository.getBudgetAnalysisByFiscalYear(
        Number(fiscalYear),
        type as any,
        category || undefined,
      )
      return NextResponse.json(analysis)
    }

    // パラメータが不足している場合
    return NextResponse.json({ error: "必要なパラメータが不足しています" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching budget analysis:", error)
    return NextResponse.json({ error: "予実分析データの取得中にエラーが発生しました" }, { status: 500 })
  }
}

// 予算作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション
    const validatedData = createBudgetSchema.parse(body)

    // 予算を作成
    const budget = await BudgetRepository.create(validatedData)

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error("Error creating budget:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力データが不正です", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "予算の作成中にエラーが発生しました" }, { status: 500 })
  }
}

// 予算更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 })
    }

    // バリデーション
    const validatedData = updateBudgetSchema.parse(updateData)

    // 予算を更新
    const budget = await BudgetRepository.update({
      id,
      ...validatedData,
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.error("Error updating budget:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力データが不正です", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "予算の更新中にエラーが発生しました" }, { status: 500 })
  }
}

// 予算削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 })
    }

    await BudgetRepository.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting budget:", error)
    return NextResponse.json({ error: "予算の削除中にエラーが発生しました" }, { status: 500 })
  }
}
