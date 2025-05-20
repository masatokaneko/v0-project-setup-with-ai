/**
 * 会計年度と四半期を計算するユーティリティ関数
 * 会計年度は12月1日から始まり、11月30日に終わる
 * Q1: 12月1日～2月28日(29日)
 * Q2: 3月1日～5月31日
 * Q3: 6月1日～8月31日
 * Q4: 9月1日～11月30日
 */

/**
 * 日付から会計年度を計算する
 * @param date 対象日付
 * @returns 会計年度
 */
export function getFiscalYear(date: Date): number {
  const month = date.getMonth() + 1 // JavaScriptの月は0から始まるため+1
  const year = date.getFullYear()

  // 12月は次の年度に属する
  return month === 12 ? year + 1 : year
}

/**
 * 日付から会計四半期を計算する
 * @param date 対象日付
 * @returns 会計四半期 (1-4)
 */
export function getFiscalQuarter(date: Date): number {
  const month = date.getMonth() + 1 // JavaScriptの月は0から始まるため+1

  // 会計四半期の計算
  if (month === 12 || month === 1 || month === 2) {
    return 1 // Q1: 12月, 1月, 2月
  } else if (month >= 3 && month <= 5) {
    return 2 // Q2: 3月, 4月, 5月
  } else if (month >= 6 && month <= 8) {
    return 3 // Q3: 6月, 7月, 8月
  } else {
    return 4 // Q4: 9月, 10月, 11月
  }
}

/**
 * 会計年度と四半期から期間の開始日と終了日を取得する
 * @param fiscalYear 会計年度
 * @param fiscalQuarter 会計四半期
 * @returns 期間の開始日と終了日
 */
export function getFiscalQuarterDateRange(
  fiscalYear: number,
  fiscalQuarter: number,
): { startDate: Date; endDate: Date } {
  let startDate: Date
  let endDate: Date

  switch (fiscalQuarter) {
    case 1: // Q1: 12月1日～2月28日(29日)
      startDate = new Date(fiscalYear - 1, 11, 1) // 前年の12月1日
      // 2月の末日を計算（うるう年対応）
      endDate = new Date(fiscalYear, 2, 0) // 2月の末日
      break
    case 2: // Q2: 3月1日～5月31日
      startDate = new Date(fiscalYear, 2, 1) // 3月1日
      endDate = new Date(fiscalYear, 5, 31) // 5月31日
      break
    case 3: // Q3: 6月1日～8月31日
      startDate = new Date(fiscalYear, 5, 1) // 6月1日
      endDate = new Date(fiscalYear, 8, 31) // 8月31日
      break
    case 4: // Q4: 9月1日～11月30日
      startDate = new Date(fiscalYear, 8, 1) // 9月1日
      endDate = new Date(fiscalYear, 11, 30) // 11月30日
      break
    default:
      throw new Error("無効な会計四半期です")
  }

  return { startDate, endDate }
}

/**
 * 会計年度の開始日と終了日を取得する
 * @param fiscalYear 会計年度
 * @returns 会計年度の開始日と終了日
 */
export function getFiscalYearDateRange(fiscalYear: number): { startDate: Date; endDate: Date } {
  const startDate = new Date(fiscalYear - 1, 11, 1) // 前年の12月1日
  const endDate = new Date(fiscalYear, 11, 30) // 当年の11月30日

  return { startDate, endDate }
}

/**
 * 会計年度と四半期を文字列形式で取得する
 * @param fiscalYear 会計年度
 * @param fiscalQuarter 会計四半期
 * @returns 「FY2023 Q1」形式の文字列
 */
export function formatFiscalYearQuarter(fiscalYear: number, fiscalQuarter: number): string {
  return `FY${fiscalYear} Q${fiscalQuarter}`
}

/**
 * 日付から会計年度と四半期を計算し、文字列形式で取得する
 * @param date 対象日付
 * @returns 「FY2023 Q1」形式の文字列
 */
export function getFiscalYearQuarterString(date: Date): string {
  const fiscalYear = getFiscalYear(date)
  const fiscalQuarter = getFiscalQuarter(date)
  return formatFiscalYearQuarter(fiscalYear, fiscalQuarter)
}
