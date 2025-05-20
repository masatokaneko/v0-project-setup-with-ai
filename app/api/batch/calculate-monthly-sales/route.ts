import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { calculateProratedAmount } from "@/lib/utils/calculation-utils"

export async function POST(request: NextRequest) {
  try {
    // リクエストからパラメータを取得
    const { dealItemId } = await request.json()

    // 特定の新規獲得契約アイテムのみ処理するか、すべて処理するか
    const dealItems = dealItemId
      ? await prisma.dealItem.findMany({ where: { id: dealItemId } })
      : await prisma.dealItem.findMany()

    const results = []

    for (const item of dealItems) {
      // 既存の月次按分データを削除
      await prisma.monthlySales.deleteMany({
        where: { dealItemId: item.id },
      })

      // 日割り計算を実行
      const proratedData = calculateProratedAmount(item.id, item.amountBeforeTax, item.startDate, item.endDate)

      // 月次按分データを作成
      for (const monthly of proratedData.monthlyBreakdown) {
        await prisma.monthlySales.create({
          data: {
            dealItemId: item.id,
            year: monthly.year,
            month: monthly.month,
            totalDaysInMonth: monthly.totalDaysInMonth,
            applicableDays: monthly.applicableDays,
            dailyRate: proratedData.dailyRate,
            amount: monthly.amount,
          },
        })
      }

      results.push({
        dealItemId: item.id,
        monthlyBreakdown: proratedData.monthlyBreakdown,
      })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Batch processing error:", error)
    return NextResponse.json({ error: "月次按分計算中にエラーが発生しました" }, { status: 500 })
  }
}
