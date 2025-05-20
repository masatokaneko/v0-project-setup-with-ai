import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">商談管理</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規商談
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商談一覧</CardTitle>
          <CardDescription>登録されている商談の一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full rounded-md border p-4">
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">商談一覧表示エリア</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
