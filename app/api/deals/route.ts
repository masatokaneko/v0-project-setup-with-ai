import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

// 商談作成スキーマ
const createDealSchema = z.object({
  name: z.string().min(1, "商談名は必須です"),
  customerId: z.string().min(1, "顧客IDは必須です"),
  dealDate: z.string().transform((str) => new Date(str)),
  status: z.enum(["OPEN", "WON", "LOST"]),
  description: z.string().optional(),
})

// 商談一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const fiscalYear = searchParams.get("fiscalYear")
    const fiscalQuarter = searchParams.get("fiscalQuarter")

    let deals

    if (status) {
      deals = await prisma.deal.findMany({
        where: { status: status as any },
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
    } else if (fiscalYear) {
      deals = await prisma.deal.findMany({
        where: {
          fiscalYear: Number(fiscalYear),
          ...(fiscalQuarter ? { fiscalQuarter: Number(fiscalQuarter) } : {}),
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
    } else {
      deals = await prisma.deal.findMany({
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

    return NextResponse.json(deals)
  } catch (error) {
    console.error("Error fetching deals:", error)
    return NextResponse.json({ error: "商談の取得中にエラーが発生しました" }, { status: 500 })
  }
}

// 商談作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション
    const validatedData = createDealSchema.parse(body)

    // 会計年度と四半期を計算
    const dealDate = validatedData.dealDate
    const fiscalYear = dealDate.getMonth() === 11 ? dealDate.getFullYear() + 1 : dealDate.getFullYear()
    const month = dealDate.getMonth() + 1
    let fiscalQuarter

    if (month === 12 || month <= 2) {
      fiscalQuarter = 1
    } else if (month <= 5) {
      fiscalQuarter = 2
    } else if (month <= 8) {
      fiscalQuarter = 3
    } else {
      fiscalQuarter = 4
    }

    // 商談を作成
    const deal = await prisma.deal.create({
      data: {
        ...validatedData,
        fiscalYear,
        fiscalQuarter,
      },
      include: {
        customer: true,
      },
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error("Error creating deal:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力データが不正です", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "商談の作成中にエラーが発生しました" }, { status: 500 })
  }
}
