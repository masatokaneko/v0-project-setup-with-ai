import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BudgetAnalysisPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">予実分析</h1>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">月次比較</TabsTrigger>
          <TabsTrigger value="cumulative">累計比較</TabsTrigger>
          <TabsTrigger value="trend">達成率トレンド</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>月次予実比較</CardTitle>
              <CardDescription>当月の予算と実績の比較</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">月次予実比較表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cumulative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>累計予実比較</CardTitle>
              <CardDescription>年度累計の予算と実績の比較</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">累計予実比較表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>予算達成率トレンド</CardTitle>
              <CardDescription>月次の予算達成率の推移</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">予算達成率トレンド表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
