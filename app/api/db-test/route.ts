import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // 簡単なクエリを実行してデータベース接続をテスト
    const result = await prisma.$queryRaw`SELECT 1 as connected`

    return NextResponse.json({
      status: "success",
      message: "データベース接続に成功しました",
      result,
    })
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "データベース接続に失敗しました",
        error: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 },
    )
  }
}
