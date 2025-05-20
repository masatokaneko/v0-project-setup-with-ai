"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function EnvCheckPage() {
  const [serverEnv, setServerEnv] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkServerEnv = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug")

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      setServerEnv(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
      console.error("Error fetching server env:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkServerEnv()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">環境変数確認</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>サーバー環境情報</CardTitle>
          <CardDescription>サーバーサイドの環境変数と設定</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>読み込み中...</p>
          ) : serverEnv ? (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">サーバー情報:</h3>
                <pre className="whitespace-pre-wrap rounded bg-gray-50 p-4">
                  {JSON.stringify(serverEnv.serverInfo, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="mb-2 font-medium">データベース接続状態:</h3>
                {serverEnv.dbStatus?.connected ? (
                  <Alert className="bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>接続成功</AlertTitle>
                    <AlertDescription>{serverEnv.dbStatus.message}</AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>接続失敗</AlertTitle>
                    <AlertDescription>
                      {serverEnv.dbStatus?.message || "データベース接続に失敗しました"}
                      {serverEnv.dbStatus?.error && (
                        <pre className="mt-2 whitespace-pre-wrap rounded bg-red-50 p-2 text-xs">
                          {serverEnv.dbStatus.error}
                        </pre>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-medium">環境変数:</h3>
                <pre className="whitespace-pre-wrap rounded bg-gray-50 p-4">
                  {JSON.stringify(serverEnv.envVars, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p>情報がありません</p>
          )}

          <Button onClick={checkServerEnv} disabled={loading} className="mt-4">
            再読み込み
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
