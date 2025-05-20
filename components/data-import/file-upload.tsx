"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  title: string
  description: string
  type: string
  onSuccess?: (data: any) => void
}

export function FileUpload({ title, description, type, onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [fileFormat, setFileFormat] = useState("csv")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "ファイルが選択されていません",
        description: "アップロードするファイルを選択してください",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)
      formData.append("format", fileFormat)

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "アップロード中にエラーが発生しました")
      }

      toast({
        title: "アップロード成功",
        description: `${data.imported?.length || 0}件のデータをインポートしました`,
      })

      if (onSuccess) {
        onSuccess(data)
      }

      // ファイル選択をリセット
      setFile(null)
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "アップロードエラー",
        description: error instanceof Error ? error.message : "不明なエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-format">ファイル形式</Label>
          <Select value={fileFormat} onValueChange={setFileFormat}>
            <SelectTrigger>
              <SelectValue placeholder="ファイル形式を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="file-upload">ファイル選択</Label>
          <Input
            id="file-upload"
            type="file"
            accept={fileFormat === "csv" ? ".csv" : ".xlsx,.xls"}
            onChange={handleFileChange}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              選択されたファイル: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              アップロード中...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              アップロード
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
