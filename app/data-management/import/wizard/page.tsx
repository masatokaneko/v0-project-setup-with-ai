import { ImportWizard } from "@/components/data-import/import-wizard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ImportWizardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">データインポートウィザード</h1>
      <p className="text-muted-foreground">
        Excelファイルからデータをインポートするためのウィザードです。 ステップに従って操作してください。
      </p>

      <Tabs defaultValue="deals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deals">商談データ</TabsTrigger>
          <TabsTrigger value="dealItems">新規獲得契約アイテム</TabsTrigger>
          <TabsTrigger value="costs">費用データ</TabsTrigger>
          <TabsTrigger value="budgets">予算データ</TabsTrigger>
        </TabsList>

        <TabsContent value="deals">
          <ImportWizard title="商談データインポート" description="商談の基本情報をインポートします" type="deals" />
        </TabsContent>

        <TabsContent value="dealItems">
          <ImportWizard
            title="新規獲得契約アイテムインポート"
            description="商談に紐づく商品情報をインポートします"
            type="dealItems"
          />
        </TabsContent>

        <TabsContent value="costs">
          <ImportWizard
            title="費用データインポート"
            description="売上原価・販管費データをインポートします"
            type="costs"
          />
        </TabsContent>

        <TabsContent value="budgets">
          <ImportWizard title="予算データインポート" description="予算データをインポートします" type="budgets" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
