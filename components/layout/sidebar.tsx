"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LineChart,
  PieChart,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react"

const sidebarItems = [
  { name: "ホーム", href: "/", icon: Home },
  { name: "ダッシュボード", href: "/dashboard", icon: BarChart3 },
  { name: "商談管理", href: "/deals", icon: Users },
  { name: "契約アイテム", href: "/deal-items", icon: ShoppingBag },
  { name: "売上詳細", href: "/revenue", icon: DollarSign },
  { name: "費用詳細", href: "/costs", icon: CreditCard },
  { name: "予実分析", href: "/budget-analysis", icon: LineChart },
  { name: "セグメント分析", href: "/segment-analysis", icon: PieChart },
  { name: "データ管理", href: "/data-management", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center font-semibold">
          <BarChart3 className="mr-2 h-5 w-5" />
          <span>経営ダッシュボード</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
