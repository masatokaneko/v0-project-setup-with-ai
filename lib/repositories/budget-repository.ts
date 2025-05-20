import { prisma } from "@/lib/db"
import { getFiscalYearDateRange, getFiscalQuarterDateRange } from "@/lib/utils/fiscal-utils"
import { RevenueRepository } from "./revenue-repository"
import { CostRepository } from "./cost-repository"
import { DealRepository } from "./deal-repository"
import { calculateAchievementRate, calculateDifference } from "@/lib/utils/calculation-utils"
import type { BudgetType } from "@prisma/client"

export class BudgetRepository {
  /**
   * 特定の年月の予算を取得する
   */
  static async getBudgetByYearMonth(year: number, month: number, type: BudgetType, category?: string) {
    const whereClause: any = {
      year,
      month,
      type,
    }

    if (category !== undefined) {
      whereClause.category = category
    }

    const budgets = await prisma.budget.findMany({
      where: whereClause,
    })

    // 合計金額を計算
    const totalAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0)

    return {
      year,
      month,
      type,
      category,
      budgets,
      totalAmount,
    }
  }

  /**
   * 会計年度の予算を取得する
   */
  static async getBudgetByFiscalYear(fiscalYear: number, type: BudgetType, category?: string) {
    const { startDate, endDate } = getFiscalYearDateRange(fiscalYear)

    // 開始年月と終了年月を計算
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    return this.getBudgetByPeriod(startYear, startMonth, endYear, endMonth, type, category)
  }

  /**
   * 会計四半期の予算を取得する
   */
  static async getBudgetByFiscalQuarter(
    fiscalYear: number,
    fiscalQuarter: number,
    type: BudgetType,
    category?: string,
  ) {
    const { startDate, endDate } = getFiscalQuarterDateRange(fiscalYear, fiscalQuarter)

    // 開始年月と終了年月を計算
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    return this.getBudgetByPeriod(startYear, startMonth, endYear, endMonth, type, category)
  }

  /**
   * 期間の予算を取得する
   */
  static async getBudgetByPeriod(
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number,
    type: BudgetType,
    category?: string,
  ) {
    // 期間内のすべての年月を生成
    const months: { year: number; month: number }[] = []
    let currentYear = startYear
    let currentMonth = startMonth

    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      months.push({ year: currentYear, month: currentMonth })

      currentMonth++
      if (currentMonth > 12) {
        currentMonth = 1
        currentYear++
      }
    }

    // 各月の予算を取得して集計
    let totalAmount = 0
    const budgets = []

    for (const { year, month } of months) {
      const budget = await this.getBudgetByYearMonth(year, month, type, category)
      totalAmount += budget.totalAmount
      budgets.push(budget)
    }

    return {
      startYear,
      startMonth,
      endYear,
      endMonth,
      type,
      category,
      budgets,
      totalAmount,
    }
  }

  /**
   * 予算を作成する
   */
  static async create(data: {
    year: number
    month: number
    type: BudgetType
    category?: string
    amount: number
    description?: string
  }) {
    return prisma.budget.create({
      data,
    })
  }

  /**
   * 予算を更新する
   */
  static async update(data: {
    id: string
    amount?: number
    description?: string
  }) {
    const { id, ...updateData } = data

    return prisma.budget.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * 予算を削除する
   */
  static async delete(id: string) {
    return prisma.budget.delete({
      where: { id },
    })
  }

  /**
   * 予実分析を取得する
   */
  static async getBudgetAnalysis(year: number, month: number, type: BudgetType, category?: string) {
    // 予算を取得
    const budget = await this.getBudgetByYearMonth(year, month, type, category)
    const budgetAmount = budget.totalAmount

    // 実績を取得
    let actualAmount = 0

    switch (type) {
      case "DEAL_ACQUISITION":
        // 新規契約獲得金額の実績
        const deals = await DealRepository.findByYearMonthAndStatus(year, month, "WON")
        actualAmount = deals.reduce((sum, deal) => {
          return (
            sum +
            deal.dealItems.reduce((itemSum, item) => {
              return itemSum + item.amountBeforeTax
            }, 0)
          )
        }, 0)
        break

      case "REVENUE":
        // 売上の実績
        const revenue = await RevenueRepository.getRevenueByYearMonth(year, month)
        actualAmount = revenue.totalAmount
        break

      case "COGS":
        // 売上原価の実績
        const costData = await CostRepository.getCostByYearMonth(year, month)
        actualAmount = costData.totalCogs
        break

      case "SGA":
        // 販管費の実績
        const sgaData = await CostRepository.getCostByYearMonth(year, month)
        actualAmount = sgaData.totalSga
        break

      case "PROFIT":
        // 利益の実績
        const revenueData = await RevenueRepository.getRevenueByYearMonth(year, month)
        const costDataForProfit = await CostRepository.getCostByYearMonth(year, month)
        actualAmount = revenueData.totalAmount - costDataForProfit.totalCost
        break
    }

    // 差異と達成率を計算
    const difference = calculateDifference(actualAmount, budgetAmount)
    const achievementRate = calculateAchievementRate(actualAmount, budgetAmount)

    return {
      year,
      month,
      type,
      category,
      budgetAmount,
      actualAmount,
      difference,
      achievementRate,
    }
  }

  /**
   * 会計年度の予実分析を取得する
   */
  static async getBudgetAnalysisByFiscalYear(fiscalYear: number, type: BudgetType, category?: string) {
    const { startDate, endDate } = getFiscalYearDateRange(fiscalYear)

    // 開始年月と終了年月を計算
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    // 予算を取得
    const budget = await this.getBudgetByPeriod(startYear, startMonth, endYear, endMonth, type, category)
    const budgetAmount = budget.totalAmount

    // 実績を取得
    let actualAmount = 0

    switch (type) {
      case "DEAL_ACQUISITION":
        // 新規契約獲得金額の実績
        const deals = await DealRepository.findByFiscalYearAndQuarter(fiscalYear)
        actualAmount = deals
          .filter((deal) => deal.status === "WON")
          .reduce((sum, deal) => {
            return (
              sum +
              deal.dealItems.reduce((itemSum, item) => {
                return itemSum + item.amountBeforeTax
              }, 0)
            )
          }, 0)
        break

      case "REVENUE":
        // 売上の実績
        const revenue = await RevenueRepository.getRevenueByFiscalYear(fiscalYear)
        actualAmount = revenue.totalAmount
        break

      case "COGS":
        // 売上原価の実績
        const costData = await CostRepository.getCostByFiscalYear(fiscalYear)
        actualAmount = costData.totalCogs
        break

      case "SGA":
        // 販管費の実績
        const sgaData = await CostRepository.getCostByFiscalYear(fiscalYear)
        actualAmount = sgaData.totalSga
        break

      case "PROFIT":
        // 利益の実績
        const revenueData = await RevenueRepository.getRevenueByFiscalYear(fiscalYear)
        const costDataForProfit = await CostRepository.getCostByFiscalYear(fiscalYear)
        actualAmount = revenueData.totalAmount - costDataForProfit.totalCost
        break
    }

    // 差異と達成率を計算
    const difference = calculateDifference(actualAmount, budgetAmount)
    const achievementRate = calculateAchievementRate(actualAmount, budgetAmount)

    return {
      fiscalYear,
      type,
      category,
      budgetAmount,
      actualAmount,
      difference,
      achievementRate,
    }
  }

  /**
   * 会計四半期の予実分析を取得する
   */
  static async getBudgetAnalysisByFiscalQuarter(
    fiscalYear: number,
    fiscalQuarter: number,
    type: BudgetType,
    category?: string,
  ) {
    const { startDate, endDate } = getFiscalQuarterDateRange(fiscalYear, fiscalQuarter)

    // 開始年月と終了年月を計算
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    // 予算を取得
    const budget = await this.getBudgetByPeriod(startYear, startMonth, endYear, endMonth, type, category)
    const budgetAmount = budget.totalAmount

    // 実績を取得
    let actualAmount = 0

    switch (type) {
      case "DEAL_ACQUISITION":
        // 新規契約獲得金額の実績
        const deals = await DealRepository.findByFiscalYearAndQuarter(fiscalYear, fiscalQuarter)
        actualAmount = deals
          .filter((deal) => deal.status === "WON")
          .reduce((sum, deal) => {
            return (
              sum +
              deal.dealItems.reduce((itemSum, item) => {
                return itemSum + item.amountBeforeTax
              }, 0)
            )
          }, 0)
        break

      case "REVENUE":
        // 売上の実績
        const revenue = await RevenueRepository.getRevenueByFiscalQuarter(fiscalYear, fiscalQuarter)
        actualAmount = revenue.totalAmount
        break

      case "COGS":
        // 売上原価の実績
        const costData = await CostRepository.getCostByFiscalQuarter(fiscalYear, fiscalQuarter)
        actualAmount = costData.totalCogs
        break

      case "SGA":
        // 販管費の実績
        const sgaData = await CostRepository.getCostByFiscalQuarter(fiscalYear, fiscalQuarter)
        actualAmount = sgaData.totalSga
        break

      case "PROFIT":
        // 利益の実績
        const revenueData = await RevenueRepository.getRevenueByFiscalQuarter(fiscalYear, fiscalQuarter)
        const costDataForProfit = await CostRepository.getCostByFiscalQuarter(fiscalYear, fiscalQuarter)
        actualAmount = revenueData.totalAmount - costDataForProfit.totalCost
        break
    }

    // 差異と達成率を計算
    const difference = calculateDifference(actualAmount, budgetAmount)
    const achievementRate = calculateAchievementRate(actualAmount, budgetAmount)

    return {
      fiscalYear,
      fiscalQuarter,
      type,
      category,
      budgetAmount,
      actualAmount,
      difference,
      achievementRate,
    }
  }
}
