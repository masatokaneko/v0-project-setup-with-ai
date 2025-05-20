import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CostsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">費用詳細</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="cogs">売上原価</TabsTrigger>
          <TabsTrigger value="sga">販管費</TabsTrigger>
          <TabsTrigger value="analysis">費用分析</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>費用推移</CardTitle>
              <CardDescription>過去12ヶ月の費用推移</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">費用推移グラフ表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cogs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>売上原価</CardTitle>
              <CardDescription>ライセンス原価・サービス原価の詳細</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">売上原価表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sga" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>販管費</CardTitle>
              <CardDescription>販管費の項目別内訳</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">販管費表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>費用分析</CardTitle>
              <CardDescription>売上高に対する費用率の分析</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">費用分析表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
