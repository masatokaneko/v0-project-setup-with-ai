import { prisma } from "@/lib/db"
import { getFiscalYearDateRange, getFiscalQuarterDateRange } from "@/lib/utils/fiscal-utils"
import type { CostType } from "@prisma/client"

export class CostRepository {
  /**
   * 特定の年月の費用データを取得する
   */
  static async getCostByYearMonth(year: number, month: number) {
    // 費用データを取得
    const costs = await prisma.cost.findMany({
      where: {
        year,
        month,
      },
    })

    // 費用種別ごとに集計
    let cogsLicense = 0
    let cogsService = 0
    let sgaPersonnel = 0
    let sgaOffice = 0
    let sgaMarketing = 0
    let sgaOther = 0

    for (const cost of costs) {
      if (cost.type === "COGS") {
        if (cost.category === "LICENSE") {
          cogsLicense += cost.amount
        } else if (cost.category === "SERVICE") {
          cogsService += cost.amount
        }
      } else if (cost.type === "SGA") {
        if (cost.category === "PERSONNEL") {
          sgaPersonnel += cost.amount
        } else if (cost.category === "OFFICE") {
          sgaOffice += cost.amount
        } else if (cost.category === "MARKETING") {
          sgaMarketing += cost.amount
        } else {
          sgaOther += cost.amount
        }
      }
    }

    const totalCogs = cogsLicense + cogsService
    const totalSga = sgaPersonnel + sgaOffice + sgaMarketing + sgaOther
    const totalCost = totalCogs + totalSga

    return {
      year,
      month,
      cogsLicense,
      cogsService,
      totalCogs,
      sgaPersonnel,
      sgaOffice,
      sgaMarketing,
      sgaOther,
      totalSga,
      totalCost,
    }
  }

  /**
   * 会計年度の費用データを取得する
   */
  static async getCostByFiscalYear(fiscalYear: number) {
    const { startDate, endDate } = getFiscalYearDateRange(fiscalYear)

    // 開始年月と終了年月を計算
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    return this.getCostByPeriod(startYear, startMonth, endYear, endMonth)
  }

  /**
   * 会計四半期の費用データを取得する
   */
  static async getCostByFiscalQuarter(fiscalYear: number, fiscalQuarter: number) {
    const { startDate, endDate } = getFiscalQuarterDateRange(fiscalYear, fiscalQuarter)

    // 開始年月と終了年月を計算
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() + 1

    return this.getCostByPeriod(startYear, startMonth, endYear, endMonth)
  }

  /**
   * 期間の費用データを取得する
   */
  static async getCostByPeriod(startYear: number, startMonth: number, endYear: number, endMonth: number) {
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

    // 各月の費用を取得して集計
    let cogsLicense = 0
    let cogsService = 0
    let sgaPersonnel = 0
    let sgaOffice = 0
    let sgaMarketing = 0
    let sgaOther = 0

    for (const { year, month } of months) {
      const cost = await this.getCostByYearMonth(year, month)
      cogsLicense += cost.cogsLicense
      cogsService += cost.cogsService
      sgaPersonnel += cost.sgaPersonnel
      sgaOffice += cost.sgaOffice
      sgaMarketing += cost.sgaMarketing
      sgaOther += cost.sgaOther
    }

    const totalCogs = cogsLicense + cogsService
    const totalSga = sgaPersonnel + sgaOffice + sgaMarketing + sgaOther
    const totalCost = totalCogs + totalSga

    return {
      startYear,
      startMonth,
      endYear,
      endMonth,
      cogsLicense,
      cogsService,
      totalCogs,
      sgaPersonnel,
      sgaOffice,
      sgaMarketing,
      sgaOther,
      totalSga,
      totalCost,
    }
  }

  /**
   * 費用を作成する
   */
  static async create(data: {
    year: number
    month: number
    type: CostType
    category: string
    amount: number
    description?: string
  }) {
    return prisma.cost.create({
      data,
    })
  }

  /**
   * 費用を更新する
   */
  static async update(data: {
    id: string
    type?: CostType
    category?: string
    amount?: number
    description?: string
  }) {
    const { id, ...updateData } = data

    return prisma.cost.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * 費用を削除する
   */
  static async delete(id: string) {
    return prisma.cost.delete({
      where: { id },
    })
  }
}
