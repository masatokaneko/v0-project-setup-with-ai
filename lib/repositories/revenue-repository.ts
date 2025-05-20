import { prisma } from "@/lib/db"
import { getFiscalYearDateRange, getFiscalQuarterDateRange } from "@/lib/utils/fiscal-utils"
import type { SalesType } from "@prisma/client"

export class RevenueRepository {
  /**
   * 特定の年月の売上データを取得する
   */
  static async getRevenueByYearMonth(year: number, month: number) {
    // 月次按分データから売上を集計
    const monthlySales = await prisma.monthlySales.findMany({
      where: {
        year,
        month,
      },
      include: {
        dealItem: {
          include: {
            product: true,
          },
        },
      },
    })

    // ライセンスとサービスの売上を集計
    let licenseAmount = 0
    let serviceAmount = 0

    for (const sale of monthlySales) {
      if (sale.dealItem.product.type === "LICENSE") {
        licenseAmount += sale.amount
      } else if (sale.dealItem.product.type === "SERVICE") {
        serviceAmount += sale.amount
      }
    }

    const totalAmount = licenseAmount + serviceAmount

    return {
      year,
      month,
      licenseAmount,
      serviceAmount,
      totalAmount,
    }
  }

  /**
   * 会計年度の売上データを取得する
   */
  static async getRevenueByFiscalYear(fiscalYear: number) {
    const { startDate, endDate } = getFiscalYearDateRange(fiscalYear)

    // 開始年月と終了年月を計算
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    return this.getRevenueByPeriod(startYear, startMonth, endYear, endMonth)
  }

  /**
   * 会計四半期の売上データを取得する
   */
  static async getRevenueByFiscalQuarter(fiscalYear: number, fiscalQuarter: number) {
    const { startDate, endDate } = getFiscalQuarterDateRange(fiscalYear, fiscalQuarter)

    // 開始年月と終了年月を計算
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    return this.getRevenueByPeriod(startYear, startMonth, endYear, endMonth)
  }

  /**
   * 期間の売上データを取得する
   */
  static async getRevenueByPeriod(startYear: number, startMonth: number, endYear: number, endMonth: number) {
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

    // 各月の売上を取得して集計
    let licenseAmount = 0
    let serviceAmount = 0

    for (const { year, month } of months) {
      const revenue = await this.getRevenueByYearMonth(year, month)
      licenseAmount += revenue.licenseAmount
      serviceAmount += revenue.serviceAmount
    }

    const totalAmount = licenseAmount + serviceAmount

    return {
      startYear,
      startMonth,
      endYear,
      endMonth,
      licenseAmount,
      serviceAmount,
      totalAmount,
    }
  }

  /**
   * 売上種別ごとの売上データを取得する
   */
  static async getRevenueBySalesType(year: number, month: number, type: SalesType) {
    // 月次按分データから売上を集計
    const monthlySales = await prisma.monthlySales.findMany({
      where: {
        year,
        month,
        dealItem: {
          product: {
            type,
          },
        },
      },
      include: {
        dealItem: {
          include: {
            product: true,
            deal: {
              include: {
                customer: true,
              },
            },
          },
        },
      },
    })

    // 商品ごとに集計
    const productRevenue: Record<string, number> = {}
    const customerRevenue: Record<string, number> = {}

    for (const sale of monthlySales) {
      const productName = sale.dealItem.product.name
      const customerName = sale.dealItem.deal.customer.name

      productRevenue[productName] = (productRevenue[productName] || 0) + sale.amount
      customerRevenue[customerName] = (customerRevenue[customerName] || 0) + sale.amount
    }

    // 合計金額
    const totalAmount = Object.values(productRevenue).reduce((sum, amount) => sum + amount, 0)

    return {
      year,
      month,
      type,
      totalAmount,
      productRevenue,
      customerRevenue,
    }
  }
}
