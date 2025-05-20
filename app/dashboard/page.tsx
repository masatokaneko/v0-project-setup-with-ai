import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, CreditCard } from "lucide-react"
import { BudgetAchievementTable } from "@/components/dashboard/budget-achievement-table"

// サンプルデータ
const sampleBudgetData = [
  {
    category: "新規契約獲得金額",
    budgetAmount: 15000000,
    actualAmount: 12500000,
    difference: -2500000,
    achievementRate: 83.3,
  },
  {
    category: "売上",
    budgetAmount: 8000000,
    actualAmount: 8350000,
    difference: 350000,
    achievementRate: 104.4,
  },
  {
    category: "売上原価",
    budgetAmount: 2000000,
    actualAmount: 1950000,
    difference: 50000,
    achievementRate: 97.5,
  },
  {
    category: "販管費",
    budgetAmount: 2400000,
    actualAmount: 2300000,
    difference: 100000,
    achievementRate: 95.8,
  },
  {
    category: "営業利益",
    budgetAmount: 3600000,
    actualAmount: 4100000,
    difference: 500000,
    achievementRate: 113.9,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ダッシュボード</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">新規契約獲得金額</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥12,500,000</div>
            <p className="text-xs text-muted-foreground">前月比 +12.5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">月次売上</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥8,350,000</div>
            <p className="text-xs text-muted-foreground">前月比 +5.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">費用</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥4,250,000</div>
            <p className="text-xs text-muted-foreground">前月比 +2.1%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">営業利益</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥4,100,000</div>
            <p className="text-xs text-muted-foreground">前月比 +8.3%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="sales">売上</TabsTrigger>
          <TabsTrigger value="costs">費用</TabsTrigger>
          <TabsTrigger value="profit">利益</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>業績推移</CardTitle>
              <CardDescription>過去12ヶ月の売上・費用・利益の推移</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">グラフ表示エリア（時系列推移）</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>売上内訳</CardTitle>
              <CardDescription>ライセンス・サービス別の売上構成</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">売上内訳グラフ表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>費用内訳</CardTitle>
              <CardDescription>売上原価・販管費の内訳</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">費用内訳グラフ表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>利益分析</CardTitle>
              <CardDescription>利益率の推移と予算達成状況</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">利益分析グラフ表示エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BudgetAchievementTable title="予算達成状況" description="主要指標の予算達成率" data={sampleBudgetData} />
    </div>
  )
}
