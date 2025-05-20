import { BatchActions } from "@/components/data-management/batch-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BatchProcessingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">バッチ処理</h1>
      <p className="text-muted-foreground">システム全体のデータ処理や再計算を行います。</p>

      <div className="grid gap-6 md:grid-cols-2">
        <BatchActions />

        <Card>
          <CardHeader>
            <CardTitle>バッチ処理履歴</CardTitle>
            <CardDescription>過去に実行されたバッチ処理の履歴</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">バッチ処理履歴はまだありません</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
