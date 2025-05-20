import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export default function DealItemsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">新規獲得契約アイテム</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規アイテム
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新規獲得契約アイテム一覧</CardTitle>
          <CardDescription>登録されている新規獲得契約アイテムの一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full rounded-md border p-4">
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">新規獲得契約アイテム一覧表示エリア</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
