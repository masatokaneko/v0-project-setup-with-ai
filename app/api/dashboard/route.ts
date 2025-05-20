import { type NextRequest, NextResponse } from "next/server"
import { DashboardService } from "@/lib/services/dashboard-service"

// ダッシュボードデータ取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year")
    const month = searchParams.get("month")
    const type = searchParams.get("type")

    // 年月が指定されていない場合は現在の年月を使用
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    const targetYear = year ? Number(year) : currentYear
    const targetMonth = month ? Number(month) : currentMonth

    // データタイプに応じて処理を分岐
    if (type === "summary") {
      const summary = await DashboardService.getDashboardSummary(targetYear, targetMonth)
      return NextResponse.json(summary)
    }

    if (type === "trend") {
      const trend = await DashboardService.getPerformanceTrend()
      return NextResponse.json(trend)
    }

    if (type === "revenue-composition") {
      const composition = await DashboardService.getRevenueComposition(targetYear, targetMonth)
      return NextResponse.json(composition)
    }

    if (type === "cost-composition") {
      const composition = await DashboardService.getCostComposition(targetYear, targetMonth)
      return NextResponse.json(composition)
    }

    if (type === "budget-achievement") {
      const achievement = await DashboardService.getBudgetAchievementSummary(targetYear, targetMonth)
      return NextResponse.json(achievement)
    }

    // デフォルトはサマリーを返す
    const summary = await DashboardService.getDashboardSummary(targetYear, targetMonth)
    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "ダッシュボードデータの取得中にエラーが発生しました" }, { status: 500 })
  }
}
