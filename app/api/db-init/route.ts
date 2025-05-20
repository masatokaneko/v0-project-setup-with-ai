import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST() {
  try {
    // 基本的なデータを作成

    // 1. 顧客データ
    const customer = await prisma.customer.upsert({
      where: { id: "cust001" },
      update: {},
      create: {
        id: "cust001",
        name: "サンプル株式会社",
        code: "SAMPLE001",
      },
    })

    // 2. 商品データ
    const product1 = await prisma.product.upsert({
      where: { id: "prod001" },
      update: {},
      create: {
        id: "prod001",
        name: "基幹システムライセンス",
        code: "LIC001",
        type: "LICENSE",
        description: "基幹システムの利用ライセンス",
      },
    })

    const product2 = await prisma.product.upsert({
      where: { id: "prod002" },
      update: {},
      create: {
        id: "prod002",
        name: "導入支援サービス",
        code: "SVC001",
        type: "SERVICE",
        description: "システム導入のためのコンサルティングサービス",
      },
    })

    // 3. 商談データ
    const deal = await prisma.deal.upsert({
      where: { id: "deal001" },
      update: {},
      create: {
        id: "deal001",
        name: "基幹システム導入案件",
        customerId: customer.id,
        dealDate: new Date(),
        fiscalYear: 2023,
        fiscalQuarter: 4,
        status: "WON",
        description: "基幹システムの導入プロジェクト",
      },
    })

    // 4. 契約アイテムデータ
    const dealItem1 = await prisma.dealItem.upsert({
      where: { id: "item001" },
      update: {},
      create: {
        id: "item001",
        dealId: deal.id,
        productId: product1.id,
        quantity: 10,
        unitPrice: 100000,
        taxRate: 0.1,
        amountBeforeTax: 1000000,
        amountAfterTax: 1100000,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    })

    const dealItem2 = await prisma.dealItem.upsert({
      where: { id: "item002" },
      update: {},
      create: {
        id: "item002",
        dealId: deal.id,
        productId: product2.id,
        quantity: 1,
        unitPrice: 500000,
        taxRate: 0.1,
        amountBeforeTax: 500000,
        amountAfterTax: 550000,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      },
    })

    // 5. 月次按分データの計算
    // 日割り計算のロジックを簡略化して実装
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    await prisma.monthlySales.upsert({
      where: {
        dealItemId_year_month: {
          dealItemId: dealItem1.id,
          year: currentYear,
          month: currentMonth,
        },
      },
      update: {},
      create: {
        dealItemId: dealItem1.id,
        year: currentYear,
        month: currentMonth,
        totalDaysInMonth: 30,
        applicableDays: 30,
        dailyRate: dealItem1.amountBeforeTax / 365,
        amount: dealItem1.amountBeforeTax / 12,
      },
    })

    await prisma.monthlySales.upsert({
      where: {
        dealItemId_year_month: {
          dealItemId: dealItem2.id,
          year: currentYear,
          month: currentMonth,
        },
      },
      update: {},
      create: {
        dealItemId: dealItem2.id,
        year: currentYear,
        month: currentMonth,
        totalDaysInMonth: 30,
        applicableDays: 30,
        dailyRate: dealItem2.amountBeforeTax / 90,
        amount: dealItem2.amountBeforeTax / 3,
      },
    })

    // 6. 費用データ
    await prisma.cost.upsert({
      where: { id: "cost001" },
      update: {},
      create: {
        id: "cost001",
        year: currentYear,
        month: currentMonth,
        type: "COGS",
        category: "LICENSE",
        amount: 500000,
        description: "ライセンス原価",
      },
    })

    await prisma.cost.upsert({
      where: { id: "cost002" },
      update: {},
      create: {
        id: "cost002",
        year: currentYear,
        month: currentMonth,
        type: "COGS",
        category: "SERVICE",
        amount: 300000,
        description: "サービス原価",
      },
    })

    await prisma.cost.upsert({
      where: { id: "cost003" },
      update: {},
      create: {
        id: "cost003",
        year: currentYear,
        month: currentMonth,
        type: "SGA",
        category: "PERSONNEL",
        amount: 800000,
        description: "人件費",
      },
    })

    // 7. 予算データ
    await prisma.budget.upsert({
      where: {
        year_month_type_category: {
          year: currentYear,
          month: currentMonth,
          type: "REVENUE",
          category: null,
        },
      },
      update: {},
      create: {
        year: currentYear,
        month: currentMonth,
        type: "REVENUE",
        amount: 2000000,
        description: "売上予算",
      },
    })

    await prisma.budget.upsert({
      where: {
        year_month_type_category: {
          year: currentYear,
          month: currentMonth,
          type: "COGS",
          category: null,
        },
      },
      update: {},
      create: {
        year: currentYear,
        month: currentMonth,
        type: "COGS",
        amount: 800000,
        description: "売上原価予算",
      },
    })

    await prisma.budget.upsert({
      where: {
        year_month_type_category: {
          year: currentYear,
          month: currentMonth,
          type: "SGA",
          category: null,
        },
      },
      update: {},
      create: {
        year: currentYear,
        month: currentMonth,
        type: "SGA",
        amount: 900000,
        description: "販管費予算",
      },
    })

    return NextResponse.json({
      success: true,
      message: "データベースの初期化に成功しました",
      data: {
        customer,
        products: [product1, product2],
        deal,
        dealItems: [dealItem1, dealItem2],
      },
    })
  } catch (error) {
    console.error("Database initialization error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "データベースの初期化に失敗しました",
        error: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 },
    )
  }
}
