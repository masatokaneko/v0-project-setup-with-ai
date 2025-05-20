import { type NextRequest, NextResponse } from "next/server"
import { RevenueRepository } from "@/lib/repositories/revenue-repository"

// 売上データ取得
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

    // 特定の年月の売上を取得
    if (year && month) {
      const revenue = await RevenueRepository.getRevenueByYearMonth(Number(year), Number(month))
      return NextResponse.json(revenue)
    }

    // 会計年度の売上を取得
    if (fiscalYear) {
      // 会計四半期が指定されている場合
      if (fiscalQuarter) {
        const revenue = await RevenueRepository.getRevenueByFiscalQuarter(Number(fiscalYear), Number(fiscalQuarter))
        return NextResponse.json(revenue)
      }

      // 会計年度全体の売上を取得
      const revenue = await RevenueRepository.getRevenueByFiscalYear(Number(fiscalYear))
      return NextResponse.json(revenue)
    }

    // 期間の売上を取得
    if (startYear && startMonth && endYear && endMonth) {
      const revenue = await RevenueRepository.getRevenueByPeriod(
        Number(startYear),
        Number(startMonth),
        Number(endYear),
        Number(endMonth),
      )
      return NextResponse.json(revenue)
    }

    // パラメータが不足している場合
    return NextResponse.json({ error: "必要なパラメータが不足しています" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching revenue:", error)
    return NextResponse.json({ error: "売上データの取得中にエラーが発生しました" }, { status: 500 })
  }
}
