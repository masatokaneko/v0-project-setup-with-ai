import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="container max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">経営ダッシュボード</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>ダッシュボード</CardTitle>
              <CardDescription>KPI概要と主要指標の可視化</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full">表示</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>商談管理</CardTitle>
              <CardDescription>商談情報の登録・編集・一覧</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/deals">
                <Button className="w-full">表示</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>売上詳細</CardTitle>
              <CardDescription>売上データの詳細分析</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/revenue">
                <Button className="w-full">表示</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>費用詳細</CardTitle>
              <CardDescription>費用データの詳細分析</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/costs">
                <Button className="w-full">表示</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>予実分析</CardTitle>
              <CardDescription>予算と実績の比較分析</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/budget-analysis">
                <Button className="w-full">表示</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>データ管理</CardTitle>
              <CardDescription>データ取込・マスタ管理</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/data-management">
                <Button className="w-full">表示</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
