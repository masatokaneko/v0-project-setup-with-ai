"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExcelParser } from "./excel-parser"
import { DataMapping } from "./data-mapping"
import { Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImportWizardProps {
  title: string
  description: string
  type: "deals" | "dealItems" | "costs" | "budgets"
  onSuccess?: () => void
}

export function ImportWizard({ title, description, type, onSuccess }: ImportWizardProps) {
  const [step, setStep] = useState<"parse" | "map" | "import">("parse")
  const [parsedData, setParsedData] = useState<any[] | null>(null)
  const [mappedData, setMappedData] = useState<any[] | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const handleParsed = (data: any[]) => {
    setParsedData(data)
    setStep("map")
  }

  const handleMapped = (data: any[]) => {
    setMappedData(data)
    setStep("import")
  }

  const handleImport = async () => {
    if (!mappedData) {
      toast({
        title: "データがありません",
        description: "インポートするデータがありません",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          data: mappedData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "インポート中にエラーが発生しました")
      }

      toast({
        title: "インポート成功",
        description: `${result.imported?.length || 0}件のデータをインポートしました`,
      })

      if (onSuccess) {
        onSuccess()
      }

      // リセット
      setParsedData(null)
      setMappedData(null)
      setStep("parse")
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "インポートエラー",
        description: error instanceof Error ? error.message : "不明なエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={step} className="space-y-4">
          <TabsList>
            <TabsTrigger value="parse" disabled={step !== "parse"}>
              1. ファイル解析
            </TabsTrigger>
            <TabsTrigger value="map" disabled={!parsedData || step === "parse"}>
              2. データマッピング
            </TabsTrigger>
            <TabsTrigger value="import" disabled={!mappedData || step !== "import"}>
              3. インポート
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parse">
            <ExcelParser onParsed={handleParsed} />
          </TabsContent>

          <TabsContent value="map">
            {parsedData && <DataMapping data={parsedData} type={type} onMapped={handleMapped} />}
          </TabsContent>

          <TabsContent value="import">
            {mappedData && (
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">インポート準備完了</h3>
                  <p className="text-sm text-muted-foreground">
                    {mappedData.length}件のデータをインポートする準備ができました。
                    「インポート実行」ボタンをクリックしてデータをインポートしてください。
                  </p>
                </div>

                <Button onClick={handleImport} disabled={isImporting} className="w-full">
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      インポート中...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      インポート実行
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
