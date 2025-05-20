import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload } from "lucide-react"

export default function DataManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">データ管理</h1>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          <TabsTrigger value="import">データ取込</TabsTrigger>
          <TabsTrigger value="master">マスタ管理</TabsTrigger>
          <TabsTrigger value="budget">予算設定</TabsTrigger>
          <TabsTrigger value="users">ユーザー設定</TabsTrigger>
        </TabsList>
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>データ取込</CardTitle>
              <CardDescription>外部データの取込処理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">商談データ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      ファイル選択
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">契約アイテムデータ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      ファイル選択
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">費用データ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      ファイル選択
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">予算データ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      ファイル選択
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="master" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>マスタ管理</CardTitle>
              <CardDescription>各種マスタデータの管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">顧客マスタ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">管理画面を開く</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">商品マスタ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">管理画面を開く</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">費用項目マスタ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">管理画面を開く</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>予算設定</CardTitle>
              <CardDescription>予算データの設定・管理</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">予算設定エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ユーザー設定</CardTitle>
              <CardDescription>ユーザー情報の管理</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full rounded-md border p-4">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">ユーザー設定エリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
