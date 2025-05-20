import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db"

export async function GET() {
  try {
    // サーバー情報の収集
    const serverInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV,
      time: new Date().toISOString(),
    }

    // データベース接続テスト
    const dbStatus = await checkDatabaseConnection()

    // 環境変数の確認（機密情報は除外）
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? "設定されています" : "設定されていません",
      POSTGRES_URL: process.env.POSTGRES_URL ? "設定されています" : "設定されていません",
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "設定されています" : "設定されていません",
    }

    return NextResponse.json({
      status: "success",
      serverInfo,
      dbStatus,
      envVars,
    })
  } catch (error) {
    console.error("Debug API error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "デバッグ情報の取得中にエラーが発生しました",
        error: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 },
    )
  }
}
