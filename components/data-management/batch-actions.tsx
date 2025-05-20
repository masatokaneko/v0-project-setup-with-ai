"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function BatchActions() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleRecalculateAll = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/batch/recalculate-all", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "バッチ処理中にエラーが発生しました")
      }

      toast({
        title: "バッチ処理成功",
        description: data.message,
      })
    } catch (error) {
      console.error("Batch processing error:", error)
      toast({
        title: "バッチ処理エラー",
        description: error instanceof Error ? error.message : "不明なエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>バッチ処理</CardTitle>
        <CardDescription>システム全体のデータ再計算を行います</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          すべての新規獲得契約アイテムの月次按分を再計算します。
          データの整合性に問題がある場合や、大量のデータを修正した後に実行してください。
        </p>
        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">会計年度について</p>
          <p className="mt-1">当社の会計年度は12月1日から始まります。</p>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Q1: 12月1日～2月28日(29日)</li>
            <li>Q2: 3月1日～5月31日</li>
            <li>Q3: 6月1日～8月31日</li>
            <li>Q4: 9月1日～11月30日</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRecalculateAll} disabled={isProcessing} className="w-full">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              処理中...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              すべての月次按分を再計算
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
