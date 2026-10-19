import type TitleInterface from '@/base/Data/Models/title_interface'

/** Disambiguate parented options without changing their titles or IDs. */
export function getSelectOptionLabel(
  option?: Pick<TitleInterface, 'title' | 'parent'> | null,
): string {
  const title = option?.title ?? ''
  const parentTitle = option?.parent?.title?.trim()
  return parentTitle ? `${title} — ${parentTitle}` : title
}
