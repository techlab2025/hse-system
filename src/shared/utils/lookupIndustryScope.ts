export interface LookupIndustryFields {
  all_industries?: 0 | 1
  industry_ids?: number[]
}

export interface LookupIndustrySelection {
  allIndustries: boolean
  industryIds: number[]
}

export const normalizeLookupIndustryIds = (ids: number[]) => [
  ...new Set(ids.map(Number).filter((id) => Number.isSafeInteger(id) && id > 0)),
]

export function applyLookupIndustryScope<T extends object>(
  rows: T[],
  scope?: LookupIndustryFields,
): T[] {
  if (!scope) return rows
  return rows.map((row) => ({
    ...row,
    all_industries: scope.all_industries === 0 ? 0 : 1,
    industry_ids:
      scope.all_industries === 0 ? normalizeLookupIndustryIds(scope.industry_ids ?? []) : [],
  }))
}
