import { SalesType, DealStatus, CostType, BudgetType } from "@prisma/client"

// 売上関連の型定義
export interface RevenueData {
  year: number
  month: number
  licenseAmount: number
  serviceAmount: number
  totalAmount: number
}

// 費用関連の型定義
export interface CostData {
  year: number
  month: number
  cogsLicense: number
  cogsService: number
  totalCogs: number
  sgaPersonnel: number
  sgaOffice: number
  sgaMarketing: number
  sgaOther: number
  totalSga: number
  totalCost: number
}

// 利益関連の型定義
export interface ProfitData {
  year: number
  month: number
  revenue: number
  cost: number
  profit: number
  profitMargin: number
}

// 予実分析関連の型定義
export interface BudgetAnalysisData {
  year: number
  month: number
  category: string
  budgetAmount: number
  actualAmount: number
  difference: number
  achievementRate: number
}

// 日割り計算関連の型定義
export interface ProratedCalculationData {
  dealItemId: string
  contractAmount: number
  startDate: Date
  endDate: Date
  totalDays: number
  dailyRate: number
  monthlyBreakdown: {
    year: number
    month: number
    totalDaysInMonth: number
    applicableDays: number
    amount: number
  }[]
}

// エクスポートする列挙型
export { SalesType, DealStatus, CostType, BudgetType }
