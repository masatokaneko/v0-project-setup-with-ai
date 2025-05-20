"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DataMappingProps {
  data: any[]
  type: "deals" | "dealItems" | "costs" | "budgets"
  onMapped?: (mappedData: any[]) => void
}

interface FieldMapping {
  sourceField: string
  targetField: string
}

export function DataMapping({ data, type, onMapped }: DataMappingProps) {
  const [mappings, setMappings] = useState<FieldMapping[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // データ型に応じたターゲットフィールドを定義
  const getTargetFields = () => {
    switch (type) {
      case "deals":
        return ["name", "customerName", "dealDate", "fiscalYear", "fiscalQuarter", "status", "description"]
      case "dealItems":
        return [
          "dealId",
          "productName",
          "productType",
          "quantity",
          "unitPrice",
          "taxRate",
          "startDate",
          "endDate",
          "productDescription",
        ]
      case "costs":
        return ["year", "month", "type", "category", "amount", "description"]
      case "budgets":
        return ["year", "month", "type", "category", "amount", "description"]
      default:
        return []
    }
  }

  // ソースフィールド（Excelの列名）を取得
  const sourceFields = data.length > 0 ? Object.keys(data[0]) : []
  const targetFields = getTargetFields()

  // マッピングを更新
  const updateMapping = (index: number, sourceField: string, targetField: string) => {
    const newMappings = [...mappings]
    newMappings[index] = { sourceField, targetField }
    setMappings(newMappings)
  }

  // マッピングを追加
  const addMapping = () => {
    setMappings([...mappings, { sourceField: "", targetField: "" }])
  }

  // マッピングを削除
  const removeMapping = (index: number) => {
    const newMappings = [...mappings]
    newMappings.splice(index, 1)
    setMappings(newMappings)
  }

  // データをマッピング
  const mapData = () => {
    if (mappings.length === 0) {
      toast({
        title: "マッピングが設定されていません",
        description: "少なくとも1つのフィールドマッピングを設定してください",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const mappedData = data.map((item) => {
        const result: Record<string, any> = {}

        mappings.forEach(({ sourceField, targetField }) => {
          if (sourceField && targetField) {
            result[targetField] = item[sourceField]
          }
        })

        return result
      })

      if (onMapped) {
        onMapped(mappedData)
      }

      toast({
        title: "マッピング成功",
        description: `${mappedData.length}件のデータをマッピングしました`,
      })
    } catch (error) {
      console.error("Mapping error:", error)
      toast({
        title: "マッピングエラー",
        description: "データのマッピング中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>データマッピング</CardTitle>
        <CardDescription>Excelデータを適切なフィールドにマッピングします</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mappings.map((mapping, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Select
              value={mapping.sourceField}
              onValueChange={(value) => updateMapping(index, value, mapping.targetField)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="ソースフィールド" />
              </SelectTrigger>
              <SelectContent>
                {sourceFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-muted-foreground">→</span>

            <Select
              value={mapping.targetField}
              onValueChange={(value) => updateMapping(index, mapping.sourceField, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="ターゲットフィールド" />
              </SelectTrigger>
              <SelectContent>
                {targetFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => removeMapping(index)} className="shrink-0">
              削除
            </Button>
          </div>
        ))}

        <div className="flex justify-between">
          <Button variant="outline" onClick={addMapping} disabled={isProcessing}>
            マッピング追加
          </Button>

          <Button onClick={mapData} disabled={mappings.length === 0 || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                処理中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                マッピング実行
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
