/**
 * 指定された年月の日数を取得する
 */
export function getDaysInMonth(year: number, month: number): number {
  // JavaScriptの月は0から始まるため、monthから1を引く
  return new Date(year, month, 0).getDate()
}

/**
 * 指定された期間の総日数を計算する
 */
export function calculateTotalDays(startDate: Date, endDate: Date): number {
  // 日付をUTCに変換して計算（タイムゾーンの影響を排除）
  const start = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()))
  const end = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()))

  // 終了日も含めるため、差分に1を加える
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  return diffDays
}

/**
 * 指定された月の適用日数を計算する
 */
export function calculateApplicableDays(
  year: number,
  month: number,
  contractStartDate: Date,
  contractEndDate: Date,
): number {
  // 月の開始日と終了日
  const monthStartDate = new Date(Date.UTC(year, month - 1, 1))
  const monthEndDate = new Date(Date.UTC(year, month, 0))

  // 契約開始日と終了日をUTCに変換
  const startDate = new Date(
    Date.UTC(contractStartDate.getFullYear(), contractStartDate.getMonth(), contractStartDate.getDate()),
  )

  const endDate = new Date(
    Date.UTC(contractEndDate.getFullYear(), contractEndDate.getMonth(), contractEndDate.getDate()),
  )

  // 月の範囲外の場合は0を返す
  if (endDate < monthStartDate || startDate > monthEndDate) {
    return 0
  }

  // 適用開始日（月の開始日と契約開始日の遅い方）
  const applicableStartDate = startDate > monthStartDate ? startDate : monthStartDate

  // 適用終了日（月の終了日と契約終了日の早い方）
  const applicableEndDate = endDate < monthEndDate ? endDate : monthEndDate

  // 適用日数を計算
  const diffTime = Math.abs(applicableEndDate.getTime() - applicableStartDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  return diffDays
}

/**
 * 契約期間内のすべての年月を取得する
 */
export function getAllMonthsInPeriod(startDate: Date, endDate: Date): { year: number; month: number }[] {
  const months: { year: number; month: number }[] = []

  // 開始年月と終了年月
  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth() + 1 // JavaScriptの月は0から始まるため+1
  const endYear = endDate.getFullYear()
  const endMonth = endDate.getMonth() + 1

  // 開始年月から終了年月までループ
  for (let year = startYear; year <= endYear; year++) {
    const monthStart = year === startYear ? startMonth : 1
    const monthEnd = year === endYear ? endMonth : 12

    for (let month = monthStart; month <= monthEnd; month++) {
      months.push({ year, month })
    }
  }

  return months
}

/**
 * 日付をYYYY-MM-DD形式の文字列に変換する
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/**
 * 年月を「YYYY年MM月」形式の文字列に変換する
 */
export function formatYearMonth(year: number, month: number): string {
  return `${year}年${String(month).padStart(2, "0")}月`
}
