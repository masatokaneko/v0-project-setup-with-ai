import { RevenueRepository } from "../repositories/revenue-repository"
import { CostRepository } from "../repositories/cost-repository"
import { BudgetRepository } from "../repositories/budget-repository"
import { DealRepository } from "../repositories/deal-repository"
import { calculateProfitMargin } from "../utils/calculation-utils"

export class DashboardService {
  /**
   * ダッシュボードサマリーデータを取得する
   */
  static async getDashboardSummary(year: number, month: number) {
    // 新規契約獲得金額（当月の成約した商談の合計金額）
    const deals = await DealRepository.findByYearMonthAndStatus(year, month, "WON")
    const dealAcquisitionAmount = deals.reduce((sum, deal) => {
      return (
        sum +
        deal.dealItems.reduce((itemSum, item) => {
          return itemSum + item.amountBeforeTax
        }, 0)
      )
    }, 0)

    // 月次売上
    const revenue = await RevenueRepository.getRevenueByYearMonth(year, month)
    const monthlyRevenue = revenue ? revenue.totalAmount : 0

    // 費用
    const cost = await CostRepository.getCostByYearMonth(year, month)
    const monthlyCost = cost ? cost.totalCost : 0

    // 営業利益
    const monthlyProfit = monthlyRevenue - monthlyCost

    // 前月のデータを取得（前月比計算用）
    const previousMonth = month === 1 ? 12 : month - 1
    const previousYear = month === 1 ? year - 1 : year

    const previousRevenue = await RevenueRepository.getRevenueByYearMonth(previousYear, previousMonth)
    const previousMonthlyRevenue = previousRevenue ? previousRevenue.totalAmount : 0

    const previousCost = await CostRepository.getCostByYearMonth(previousYear, previousMonth)
    const previousMonthlyCost = previousCost ? previousCost.totalCost : 0

    const previousMonthlyProfit = previousMonthlyRevenue - previousMonthlyCost

    const previousDeals = await DealRepository.findByYearMonthAndStatus(previousYear, previousMonth, "WON")
    const previousDealAcquisitionAmount = previousDeals.reduce((sum, deal) => {
      return (
        sum +
        deal.dealItems.reduce((itemSum, item) => {
          return itemSum + item.amountBeforeTax
        }, 0)
      )
    }, 0)

    // 前月比計算
    const calculateChangeRate = (current: number, previous: number) => {
      if (previous === 0) return 0
      return ((current - previous) / previous) * 100
    }

    const dealAcquisitionChangeRate = calculateChangeRate(dealAcquisitionAmount, previousDealAcquisitionAmount)
    const revenueChangeRate = calculateChangeRate(monthlyRevenue, previousMonthlyRevenue)
    const costChangeRate = calculateChangeRate(monthlyCost, previousMonthlyCost)
    const profitChangeRate = calculateChangeRate(monthlyProfit, previousMonthlyProfit)

    return {
      dealAcquisition: {
        amount: dealAcquisitionAmount,
        changeRate: dealAcquisitionChangeRate,
      },
      revenue: {
        amount: monthlyRevenue,
        changeRate: revenueChangeRate,
      },
      cost: {
        amount: monthlyCost,
        changeRate: costChangeRate,
      },
      profit: {
        amount: monthlyProfit,
        changeRate: profitChangeRate,
      },
    }
  }

  /**
   * 業績推移データを取得する
   */
  static async getPerformanceTrend(months = 12) {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    const trend = []

    // 過去12ヶ月のデータを取得
    for (let i = 0; i < months; i++) {
      // 対象年月を計算
      let targetMonth = currentMonth - i
      let targetYear = currentYear

      while (targetMonth <= 0) {
        targetMonth += 12
        targetYear -= 1
      }

      // 売上データを取得
      const revenue = await RevenueRepository.getRevenueByYearMonth(targetYear, targetMonth)
      const revenueAmount = revenue ? revenue.totalAmount : 0

      // 費用データを取得
      const cost = await CostRepository.getCostByYearMonth(targetYear, targetMonth)
      const costAmount = cost ? cost.totalCost : 0

      // 利益を計算
      const profit = revenueAmount - costAmount
      const profitMargin = calculateProfitMargin(revenueAmount, profit)

      trend.unshift({
        year: targetYear,
        month: targetMonth,
        revenue: revenueAmount,
        cost: costAmount,
        profit: profit,
        profitMargin: profitMargin,
      })
    }

    return trend
  }

  /**
   * 売上構成データを取得する
   */
  static async getRevenueComposition(year: number, month: number) {
    const revenue = await RevenueRepository.getRevenueByYearMonth(year, month)

    if (!revenue) {
      return []
    }

    return [
      {
        name: "ライセンス",
        value: revenue.licenseAmount,
        percentage: (revenue.licenseAmount / revenue.totalAmount) * 100,
      },
      {
        name: "サービス",
        value: revenue.serviceAmount,
        percentage: (revenue.serviceAmount / revenue.totalAmount) * 100,
      },
    ]
  }

  /**
   * 費用構成データを取得する
   */
  static async getCostComposition(year: number, month: number) {
    const cost = await CostRepository.getCostByYearMonth(year, month)

    if (!cost) {
      return []
    }

    return [
      {
        name: "ライセンス原価",
        value: cost.cogsLicense,
        percentage: (cost.cogsLicense / cost.totalCost) * 100,
      },
      {
        name: "サービス原価",
        value: cost.cogsService,
        percentage: (cost.cogsService / cost.totalCost) * 100,
      },
      {
        name: "人件費",
        value: cost.sgaPersonnel,
        percentage: (cost.sgaPersonnel / cost.totalCost) * 100,
      },
      {
        name: "オフィス費",
        value: cost.sgaOffice,
        percentage: (cost.sgaOffice / cost.totalCost) * 100,
      },
      {
        name: "マーケティング費",
        value: cost.sgaMarketing,
        percentage: (cost.sgaMarketing / cost.totalCost) * 100,
      },
      {
        name: "その他",
        value: cost.sgaOther,
        percentage: (cost.sgaOther / cost.totalCost) * 100,
      },
    ]
  }

  /**
   * 予算達成状況サマリーを取得する
   */
  static async getBudgetAchievementSummary(year: number, month: number) {
    // 新規契約獲得金額の予実
    const dealAcquisitionAnalysis = await BudgetRepository.getBudgetAnalysis(year, month, "DEAL_ACQUISITION", undefined)

    // 売上の予実
    const revenueAnalysis = await BudgetRepository.getBudgetAnalysis(year, month, "REVENUE", undefined)

    // 費用の予実
    const cogsAnalysis = await BudgetRepository.getBudgetAnalysis(year, month, "COGS", undefined)
    const sgaAnalysis = await BudgetRepository.getBudgetAnalysis(year, month, "SGA", undefined)

    // 利益の予実
    const profitAnalysis = await BudgetRepository.getBudgetAnalysis(year, month, "PROFIT", undefined)

    return [
      {
        category: "新規契約獲得金額",
        budgetAmount: dealAcquisitionAnalysis?.budgetAmount || 0,
        actualAmount: dealAcquisitionAnalysis?.actualAmount || 0,
        difference: dealAcquisitionAnalysis?.difference || 0,
        achievementRate: dealAcquisitionAnalysis?.achievementRate || 0,
      },
      {
        category: "売上",
        budgetAmount: revenueAnalysis?.budgetAmount || 0,
        actualAmount: revenueAnalysis?.actualAmount || 0,
        difference: revenueAnalysis?.difference || 0,
        achievementRate: revenueAnalysis?.achievementRate || 0,
      },
      {
        category: "売上原価",
        budgetAmount: cogsAnalysis?.budgetAmount || 0,
        actualAmount: cogsAnalysis?.actualAmount || 0,
        difference: cogsAnalysis?.difference || 0,
        achievementRate: cogsAnalysis?.achievementRate || 0,
      },
      {
        category: "販管費",
        budgetAmount: sgaAnalysis?.budgetAmount || 0,
        actualAmount: sgaAnalysis?.actualAmount || 0,
        difference: sgaAnalysis?.difference || 0,
        achievementRate: sgaAnalysis?.achievementRate || 0,
      },
      {
        category: "営業利益",
        budgetAmount: profitAnalysis?.budgetAmount || 0,
        actualAmount: profitAnalysis?.actualAmount || 0,
        difference: profitAnalysis?.difference || 0,
        achievementRate: profitAnalysis?.achievementRate || 0,
      },
    ]
  }
}
