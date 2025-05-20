import { prisma } from "@/lib/db"
import {
  getFiscalYear,
  getFiscalQuarter,
  getFiscalYearDateRange,
  getFiscalQuarterDateRange,
} from "@/lib/utils/fiscal-utils"
import type { Prisma, DealStatus } from "@prisma/client"

export class DealRepository {
  /**
   * すべての商談を取得する
   */
  static async findAll() {
    return prisma.deal.findMany({
      include: {
        customer: true,
        dealItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        dealDate: "desc",
      },
    })
  }

  /**
   * IDで商談を取得する
   */
  static async findById(id: string) {
    return prisma.deal.findUnique({
      where: { id },
      include: {
        customer: true,
        dealItems: {
          include: {
            product: true,
            monthlySales: true,
          },
        },
      },
    })
  }

  /**
   * ステータスで商談を取得する
   */
  static async findByStatus(status: DealStatus) {
    return prisma.deal.findMany({
      where: { status },
      include: {
        customer: true,
        dealItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        dealDate: "desc",
      },
    })
  }

  /**
   * 会計年度と四半期で商談を取得する
   */
  static async findByFiscalYearAndQuarter(fiscalYear: number, fiscalQuarter?: number) {
    let dateRange

    if (fiscalQuarter) {
      // 特定の会計四半期の期間を取得
      dateRange = getFiscalQuarterDateRange(fiscalYear, fiscalQuarter)
    } else {
      // 会計年度全体の期間を取得
      dateRange = getFiscalYearDateRange(fiscalYear)
    }

    return prisma.deal.findMany({
      where: {
        dealDate: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      include: {
        customer: true,
        dealItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        dealDate: "desc",
      },
    })
  }

  /**
   * 年月とステータスで商談を取得する
   */
  static async findByYearMonthAndStatus(year: number, month: number, status: DealStatus) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    return prisma.deal.findMany({
      where: {
        dealDate: {
          gte: startDate,
          lte: endDate,
        },
        status,
      },
      include: {
        customer: true,
        dealItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        dealDate: "desc",
      },
    })
  }

  /**
   * 商談を作成する
   */
  static async create(data: Omit<Prisma.DealCreateInput, "fiscalYear" | "fiscalQuarter">) {
    const dealDate = data.dealDate as Date

    // 会計年度と四半期を計算
    const fiscalYear = getFiscalYear(dealDate)
    const fiscalQuarter = getFiscalQuarter(dealDate)

    return prisma.deal.create({
      data: {
        ...data,
        fiscalYear,
        fiscalQuarter,
      },
      include: {
        customer: true,
      },
    })
  }

  /**
   * 商談を更新する
   */
  static async update(data: Prisma.DealUpdateInput & { id: string }) {
    const { id, ...updateData } = data

    // 更新データに dealDate が含まれている場合は会計年度と四半期を再計算
    if (updateData.dealDate) {
      const dealDate = updateData.dealDate as Date
      updateData.fiscalYear = getFiscalYear(dealDate)
      updateData.fiscalQuarter = getFiscalQuarter(dealDate)
    }

    return prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
      },
    })
  }

  /**
   * 商談を削除する
   */
  static async delete(id: string) {
    return prisma.deal.delete({
      where: { id },
    })
  }
}
