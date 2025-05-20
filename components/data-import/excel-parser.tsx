"use client"

import type React from "react"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExcelParserProps {
  onParsed?: (data: any[]) => void
}

export function ExcelParser({ onParsed }: ExcelParserProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [parsedData, setParsedData] = useState<any[] | null>(null)
  const [jsonData, setJsonData] = useState("")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setParsedData(null)
      setJsonData("")
    }
  }

  const parseExcel = async () => {
    if (!file) {
      toast({
        title: "ファイルが選択されていません",
        description: "Excelファイルを選択してください",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      setParsedData(jsonData)
      setJsonData(JSON.stringify(jsonData, null, 2))

      if (onParsed) {
        onParsed(jsonData)
      }

      toast({
        title: "ファイル解析成功",
        description: `${jsonData.length}件のデータを解析しました`,
      })
    } catch (error) {
      console.error("Excel parsing error:", error)
      toast({
        title: "ファイル解析エラー",
        description: "Excelファイルの解析中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Excelデータ解析</CardTitle>
        <CardDescription>Excelファイルを解析してデータを抽出します</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="excel-file">Excelファイル選択</Label>
          <Input id="excel-file" type="file" accept=".xlsx,.xls" onChange={handleFileChange} disabled={isLoading} />
          {file && (
            <p className="text-sm text-muted-foreground">
              選択されたファイル: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>

        <Button onClick={parseExcel} disabled={!file || isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              解析中...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              ファイルを解析
            </>
          )}
        </Button>

        {parsedData && (
          <Tabs defaultValue="table" className="mt-4">
            <TabsList>
              <TabsTrigger value="table">テーブル表示</TabsTrigger>
              <TabsTrigger value="json">JSON表示</TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="mt-2">
              <div className="rounded-md border">
                <div className="max-h-96 overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {parsedData.length > 0 &&
                          Object.keys(parsedData[0]).map((key) => (
                            <th key={key} className="p-2 text-left text-sm font-medium">
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.map((row, i) => (
                        <tr key={i} className="border-b">
                          {Object.values(row).map((value, j) => (
                            <td key={j} className="p-2 text-sm">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="json" className="mt-2">
              <Textarea value={jsonData} readOnly className="h-96 font-mono text-xs" />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
