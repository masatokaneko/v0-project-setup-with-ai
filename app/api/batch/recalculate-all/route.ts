import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { calculateProratedAmount } from "@/lib/utils/calculation-utils"

export async function POST() {
  try {
    // すべての新規獲得契約アイテムを取得
    const dealItems = await prisma.dealItem.findMany()

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

    return NextResponse.json({
      success: true,
      message: `${results.length}件の新規獲得契約アイテムの月次按分を再計算しました`,
      results,
    })
  } catch (error) {
    console.error("Batch recalculation error:", error)
    return NextResponse.json({ error: "月次按分の再計算中にエラーが発生しました" }, { status: 500 })
  }
}
