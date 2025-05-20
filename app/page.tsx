// ホームページのリダイレクトを追加
import { redirect } from "next/navigation"

export default function Home() {
  // ダッシュボードページにリダイレクト
  redirect("/dashboard")
}
