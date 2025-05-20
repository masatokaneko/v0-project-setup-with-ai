import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { calculateProratedAmount } from "@/lib/utils/calculation-utils"
import type { SalesType, DealStatus, CostType, BudgetType } from "@prisma/client"

// 以下のimport文を追加
import { getFiscalYear, getFiscalQuarter } from "@/lib/utils/fiscal-utils"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "ファイルが提供されていません" }, { status: 400 })
    }

    // ファイルの内容を読み込む
    const fileBuffer = await file.arrayBuffer()
    const fileContent = Buffer.from(fileBuffer).toString()

    // CSVまたはExcelファイルを解析する処理
    // 実際の実装ではExcelJSなどのライブラリを使用
    // ここではCSVとして簡易的に処理
    const rows = parseCSV(fileContent)

    // データ型に応じた処理
    let result
    switch (type) {
      case "deals":
        result = await importDeals(rows)
        break
      case "dealItems":
        result = await importDealItems(rows)
        break
      case "costs":
        result = await importCosts(rows)
        break
      case "budgets":
        result = await importBudgets(rows)
        break
      default:
        return NextResponse.json({ error: "不明なデータ型です" }, { status: 400 })
    }

    return NextResponse.json({ success: true, imported: result })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "データのインポート中にエラーが発生しました" }, { status: 500 })
  }
}

// CSVを解析する簡易関数
function parseCSV(content: string) {
  const lines = content.split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",").map((v) => v.trim())
      return headers.reduce(
        (obj, header, i) => {
          obj[header] = values[i]
          return obj
        },
        {} as Record<string, string>,
      )
    })
}

// 商談データのインポート
async function importDeals(rows: Record<string, string>[]) {
  const imported = []

  for (const row of rows) {
    const dealDate = new Date(row.dealDate)
    const deal = await prisma.deal.create({
      data: {
        name: row.name,
        dealDate: dealDate,
        fiscalYear: getFiscalYear(dealDate),
        fiscalQuarter: getFiscalQuarter(dealDate),
        status: row.status as DealStatus,
        description: row.description,
        customer: {
          connectOrCreate: {
            where: { name: row.customerName },
            create: { name: row.customerName },
          },
        },
      },
    })

    imported.push(deal)
  }

  return imported
}

// 新規獲得契約アイテムのインポート
async function importDealItems(rows: Record<string, string>[]) {
  const imported = []

  for (const row of rows) {
    // 商品の取得または作成
    const product = await prisma.product.upsert({
      where: { name: row.productName },
      update: {},
      create: {
        name: row.productName,
        type: row.productType as SalesType,
        description: row.productDescription || null,
      },
    })

    // 契約金額の計算
    const unitPrice = Number.parseFloat(row.unitPrice)
    const quantity = Number.parseInt(row.quantity || "1")
    const amountBeforeTax = unitPrice * quantity
    const taxRate = Number.parseFloat(row.taxRate || "0.1")
    const amountAfterTax = amountBeforeTax * (1 + taxRate)

    // 契約期間
    const startDate = new Date(row.startDate)
    const endDate = new Date(row.endDate)

    // 新規獲得契約アイテムの作成
    const dealItem = await prisma.dealItem.create({
      data: {
        dealId: row.dealId,
        productId: product.id,
        quantity,
        unitPrice,
        taxRate,
        amountBeforeTax,
        amountAfterTax,
        startDate,
        endDate,
      },
    })

    // 日割り計算を実行
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

    imported.push(dealItem)
  }

  return imported
}

// 費用データのインポート
async function importCosts(rows: Record<string, string>[]) {
  const imported = []

  for (const row of rows) {
    const cost = await prisma.cost.create({
      data: {
        year: Number.parseInt(row.year),
        month: Number.parseInt(row.month),
        type: row.type as CostType,
        category: row.category,
        amount: Number.parseFloat(row.amount),
        description: row.description,
      },
    })

    imported.push(cost)
  }

  return imported
}

// 予算データのインポート
async function importBudgets(rows: Record<string, string>[]) {
  const imported = []

  for (const row of rows) {
    const budget = await prisma.budget.upsert({
      where: {
        year_month_type_category: {
          year: Number.parseInt(row.year),
          month: Number.parseInt(row.month),
          type: row.type as BudgetType,
          category: row.category || null,
        },
      },
      update: {
        amount: Number.parseFloat(row.amount),
      },
      create: {
        year: Number.parseInt(row.year),
        month: Number.parseInt(row.month),
        type: row.type as BudgetType,
        category: row.category || null,
        amount: Number.parseFloat(row.amount),
        description: row.description,
      },
    })

    imported.push(budget)
  }

  return imported
}
