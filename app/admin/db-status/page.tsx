"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function DbStatusPage() {
  const [status, setStatus] = useState<{
    loading: boolean
    connected: boolean
    message: string
    error?: string
    details?: any
  }>({
    loading: true,
    connected: false,
    message: "データベース接続を確認中...",
  })

  const checkConnection = async () => {
    setStatus({
      loading: true,
      connected: false,
      message: "データベース接続を確認中...",
    })

    try {
      const response = await fetch("/api/db-test")
      const data = await response.json()

      if (response.ok) {
        setStatus({
          loading: false,
          connected: true,
          message: data.message || "データベース接続に成功しました",
          details: data.result,
        })
      } else {
        setStatus({
          loading: false,
          connected: false,
          message: data.message || "データベース接続に失敗しました",
          error: data.error || "不明なエラー",
        })
      }
    } catch (error) {
      setStatus({
        loading: false,
        connected: false,
        message: "データベース接続の確認中にエラーが発生しました",
        error: error instanceof Error ? error.message : "不明なエラー",
      })
    }
  }

  const initializeDatabase = async () => {
    setStatus({
      loading: true,
      connected: false,
      message: "データベースを初期化中...",
    })

    try {
      const response = await fetch("/api/db-init", {
        method: "POST",
      })
      const data = await response.json()

      if (response.ok) {
        setStatus({
          loading: false,
          connected: true,
          message: data.message || "データベースの初期化に成功しました",
          details: data.data,
        })
      } else {
        setStatus({
          loading: false,
          connected: false,
          message: data.message || "データベースの初期化に失敗しました",
          error: data.error || "不明なエラー",
        })
      }
    } catch (error) {
      setStatus({
        loading: false,
        connected: false,
        message: "データベースの初期化中にエラーが発生しました",
        error: error instanceof Error ? error.message : "不明なエラー",
      })
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">データベース接続ステータス</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>接続ステータス</CardTitle>
          <CardDescription>データベース接続の現在の状態</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-muted p-3 rounded-full">
              {status.loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : status.connected ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div>
              <h3 className="font-medium">{status.message}</h3>
              {status.error && <p className="text-sm text-red-500">{status.error}</p>}
            </div>
          </div>

          {status.details && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">詳細情報:</h4>
              <pre className="text-xs overflow-auto p-2 bg-background rounded border">
                {JSON.stringify(status.details, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <Button onClick={checkConnection} disabled={status.loading}>
              {status.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  確認中...
                </>
              ) : (
                "接続を確認"
              )}
            </Button>
            <Button onClick={initializeDatabase} disabled={status.loading} variant="outline">
              {status.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  初期化中...
                </>
              ) : (
                "データベースを初期化"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>環境変数</CardTitle>
          <CardDescription>データベース接続に関連する環境変数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">DATABASE_URL:</span>{" "}
              <span className="font-mono text-xs">{process.env.DATABASE_URL ? "設定済み" : "未設定"}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">POSTGRES_URL:</span>{" "}
              <span className="font-mono text-xs">{process.env.POSTGRES_URL ? "設定済み" : "未設定"}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">POSTGRES_PRISMA_URL:</span>{" "}
              <span className="font-mono text-xs">{process.env.POSTGRES_PRISMA_URL ? "設定済み" : "未設定"}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">NODE_ENV:</span>{" "}
              <span className="font-mono text-xs">{process.env.NODE_ENV || "未設定"}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
