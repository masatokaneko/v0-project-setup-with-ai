import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">売上詳細</h1>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">月次売上</TabsTrigger>
          <TabsTrigger value="license">ライセンス</TabsTrigger>
          <TabsTrigger value="service">サービス</TabsTrigger>
          <TabsTrigger value="prorated">日割り計算明細</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>月次売上推移</CardTitle>
              <CardDescription>過去12ヶ月の月次売上推移</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">月次売上グラフ表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="license" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ライセンス売上</CardTitle>
              <CardDescription>ライセンス売上の詳細</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">ライセンス売上表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="service" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>サービス売上</CardTitle>
              <CardDescription>サービス売上の詳細</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">サービス売上表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prorated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>日割り計算明細</CardTitle>
              <CardDescription>契約の日割り計算による月次按分明細</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">日割り計算明細表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
