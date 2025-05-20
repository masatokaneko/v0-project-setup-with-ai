import { FileUpload } from "@/components/data-import/file-upload"

export default function DataImportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">データ取込</h1>
      <p className="text-muted-foreground">
        外部データをシステムに取り込みます。CSVまたはExcel形式のファイルをアップロードしてください。
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FileUpload title="商談データ" description="商談の基本情報をインポートします" type="deals" />

        <FileUpload
          title="新規獲得契約アイテム"
          description="商談に紐づく商品情報をインポートします"
          type="dealItems"
        />

        <FileUpload title="費用データ" description="売上原価・販管費データをインポートします" type="costs" />

        <FileUpload title="予算データ" description="予算データをインポートします" type="budgets" />

        <FileUpload title="顧客データ" description="顧客マスタデータをインポートします" type="customers" />

        <FileUpload title="商品データ" description="商品マスタデータをインポートします" type="products" />
      </div>
    </div>
  )
}
