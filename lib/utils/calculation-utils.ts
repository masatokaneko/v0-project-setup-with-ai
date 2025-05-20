import { getDaysInMonth, calculateTotalDays, calculateApplicableDays, getAllMonthsInPeriod } from "./date-utils"
import type { ProratedCalculationData } from "../types"

/**
 * 日割り計算を行い、月次按分データを生成する
 */
export function calculateProratedAmount(
  dealItemId: string,
  contractAmount: number,
  startDate: Date,
  endDate: Date,
): ProratedCalculationData {
  // 契約期間の総日数を計算
  const totalDays = calculateTotalDays(startDate, endDate)

  // 日割り単価を計算
  const dailyRate = contractAmount / totalDays

  // 契約期間内のすべての年月を取得
  const months = getAllMonthsInPeriod(startDate, endDate)

  // 各月の按分金額を計算
  const monthlyBreakdown = months.map(({ year, month }) => {
    // 月の総日数
    const totalDaysInMonth = getDaysInMonth(year, month)

    // 適用日数
    const applicableDays = calculateApplicableDays(year, month, startDate, endDate)

    // 按分金額
    const amount = dailyRate * applicableDays

    return {
      year,
      month,
      totalDaysInMonth,
      applicableDays,
      amount: Math.round(amount * 100) / 100, // 小数点第2位で四捨五入
    }
  })

  return {
    dealItemId,
    contractAmount,
    startDate,
    endDate,
    totalDays,
    dailyRate: Math.round(dailyRate * 100) / 100, // 小数点第2位で四捨五入
    monthlyBreakdown,
  }
}

/**
 * 予算達成率を計算する
 */
export function calculateAchievementRate(actual: number, budget: number): number {
  if (budget === 0) return 0
  return Math.round((actual / budget) * 10000) / 100 // パーセンテージで小数点第2位まで
}

/**
 * 予実差異を計算する
 */
export function calculateDifference(actual: number, budget: number): number {
  return Math.round((actual - budget) * 100) / 100 // 小数点第2位で四捨五入
}

/**
 * 利益率を計算する
 */
export function calculateProfitMargin(revenue: number, profit: number): number {
  if (revenue === 0) return 0
  return Math.round((profit / revenue) * 10000) / 100 // パーセンテージで小数点第2位まで
}
