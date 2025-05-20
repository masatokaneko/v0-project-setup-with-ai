import { prisma } from "@/lib/db"
import { calculateProratedAmount } from "@/lib/utils/calculation-utils"
import type { Prisma } from "@prisma/client"

export class DealItemRepository {
  /**
   * すべての新規獲得契約アイテムを取得する
   */
  static async findAll() {
    return prisma.dealItem.findMany({
      include: {
        deal: {
          include: {
            customer: true,
          },
        },
        product: true,
        monthlySales: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  /**
   * IDで新規獲得契約アイテムを取得する
   */
  static async findById(id: string) {
    return prisma.dealItem.findUnique({
      where: { id },
      include: {
        deal: {
          include: {
            customer: true,
          },
        },
        product: true,
        monthlySales: true,
      },
    })
  }

  /**
   * 商談IDで新規獲得契約アイテムを取得する
   */
  static async findByDealId(dealId: string) {
    return prisma.dealItem.findMany({
      where: { dealId },
      include: {
        product: true,
        monthlySales: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  /**
   * 新規獲得契約アイテムを作成する
   */
  static async create(data: Prisma.DealItemCreateInput) {
    // 契約金額の計算
    const amountBeforeTax = data.unitPrice * data.quantity
    const amountAfterTax = amountBeforeTax * (1 + data.taxRate)

    // 新規獲得契約アイテムを作成
    const dealItem = await prisma.dealItem.create({
      data: {
        ...data,
        amountBeforeTax,
        amountAfterTax,
      },
    })

    // 日割り計算を実行
    const proratedData = calculateProratedAmount(
      dealItem.id,
      amountBeforeTax,
      data.startDate as Date,
      data.endDate as Date,
    )

    // 月次按分データを作成
    for (const monthly of proratedData.monthlyBreakdown) {
      await prisma.monthlySales.create({
        data: {
          dealItemId: dealItem.id,
          year: monthly.year,
          month: monthly.month,
          totalDaysInMonth: monthly.totalDaysInMonth,
          applicableDays: monthly.applicableDays,
          dailyRate: proratedData.dailyRate,
          amount: monthly.amount,
        },
      })
    }

    return dealItem
  }

  /**
   * 新規獲得契約アイテムを更新する
   */
  static async update(data: Prisma.DealItemUpdateInput & { id: string }) {
    const { id, ...updateData } = data

    // 更新前のデータを取得
    const existingDealItem = await prisma.dealItem.findUnique({
      where: { id },
    })

    if (!existingDealItem) {
      throw new Error("新規獲得契約アイテムが見つかりません")
    }

    // 契約金額の再計算
    const unitPrice = updateData.unitPrice !== undefined ? Number(updateData.unitPrice) : existingDealItem.unitPrice
    const quantity = updateData.quantity !== undefined ? Number(updateData.quantity) : existingDealItem.quantity
    const taxRate = updateData.taxRate !== undefined ? Number(updateData.taxRate) : existingDealItem.taxRate

    const amountBeforeTax = unitPrice * quantity
    const amountAfterTax = amountBeforeTax * (1 + taxRate)

    // 新規獲得契約アイテムを更新
    const dealItem = await prisma.dealItem.update({
      where: { id },
      data: {
        ...updateData,
        amountBeforeTax,
        amountAfterTax,
      },
    })

    // 契約期間が変更された場合は月次按分を再計算
    if (updateData.startDate || updateData.endDate || updateData.unitPrice || updateData.quantity) {
      // 既存の月次按分データを削除
      await prisma.monthlySales.deleteMany({
        where: { dealItemId: id },
      })

      // 日割り計算を実行
      const startDate = updateData.startDate ? (updateData.startDate as Date) : existingDealItem.startDate
      const endDate = updateData.endDate ? (updateData.endDate as Date) : existingDealItem.endDate

      const proratedData = calculateProratedAmount(dealItem.id, amountBeforeTax, startDate, endDate)

      // 月次按分データを作成
      for (const monthly of proratedData.monthlyBreakdown) {
        await prisma.monthlySales.create({
          data: {
            dealItemId: dealItem.id,
            year: monthly.year,
            month: monthly.month,
            totalDaysInMonth: monthly.totalDaysInMonth,
            applicableDays: monthly.applicableDays,
            dailyRate: proratedData.dailyRate,
            amount: monthly.amount,
          },
        })
      }
    }

    return dealItem
  }

  /**
   * 新規獲得契約アイテムを削除する
   */
  static async delete(id: string) {
    // 関連する月次按分データは外部キー制約でカスケード削除される
    return prisma.dealItem.delete({
      where: { id },
    })
  }

  /**
   * 年月で新規獲得契約アイテムを取得する
   */
  static async findByYearMonth(year: number, month: number) {
    return prisma.dealItem.findMany({
      where: {
        monthlySales: {
          some: {
            year,
            month,
          },
        },
      },
      include: {
        deal: {
          include: {
            customer: true,
          },
        },
        product: true,
        monthlySales: {
          where: {
            year,
            month,
          },
        },
      },
    })
  }
}
