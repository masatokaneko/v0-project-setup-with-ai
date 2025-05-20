import { PrismaClient } from "@prisma/client"

// PrismaClientのグローバルインスタンスを作成
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// 開発環境では既存のPrismaインスタンスを再利用し、
// 本番環境では新しいインスタンスを作成
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "pretty",
  })

// 開発環境でのホットリロード時にPrismaインスタンスを再利用
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// データベース接続のヘルスチェック関数
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1 as connected`
    return { connected: true, message: "データベース接続に成功しました" }
  } catch (error) {
    console.error("Database connection error:", error)
    return {
      connected: false,
      message: "データベース接続に失敗しました",
      error: error instanceof Error ? error.message : "不明なエラー",
    }
  }
}
