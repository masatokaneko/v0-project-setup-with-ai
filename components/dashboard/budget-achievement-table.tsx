"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BudgetAchievementItem {
  category: string
  budgetAmount: number
  actualAmount: number
  difference: number
  achievementRate: number
}

interface BudgetAchievementTableProps {
  title?: string
  description?: string
  data: BudgetAchievementItem[]
}

export function BudgetAchievementTable({ title = "予算達成状況", description, data }: BudgetAchievementTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>カテゴリ</TableHead>
              <TableHead className="text-right">予算</TableHead>
              <TableHead className="text-right">実績</TableHead>
              <TableHead className="text-right">差異</TableHead>
              <TableHead className="text-right">達成率</TableHead>
              <TableHead>進捗</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.category}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell className="text-right">
                  {item.budgetAmount.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}
                </TableCell>
                <TableCell className="text-right">
                  {item.actualAmount.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}
                </TableCell>
                <TableCell className={`text-right ${item.difference >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {item.difference.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}
                </TableCell>
                <TableCell className="text-right">{item.achievementRate.toFixed(1)}%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={Math.min(item.achievementRate, 100)}
                      className="h-2"
                      indicatorClassName={
                        item.achievementRate >= 100
                          ? "bg-green-600"
                          : item.achievementRate >= 80
                            ? "bg-yellow-500"
                            : "bg-red-600"
                      }
                    />
                    <span className="w-10 text-xs">{item.achievementRate.toFixed(1)}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
