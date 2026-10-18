import TitleInterface from '@/base/Data/Models/title_interface'

import type {
  ObjectiveDirectionEnum,
  ObjectiveTargetTypeEnum,
} from '../../Core/enums/objectivesEnums'

export default class ObjectivesDetailsModel {
  constructor(
    public id: number,
    public year: string,
    public objective: string,
    public project: TitleInterface | null,
    public targetType: ObjectiveTargetTypeEnum,
    public direction: ObjectiveDirectionEnum | null,
    public department: TitleInterface | null,
    public followUpEmployee: TitleInterface | null,
    public target: number | null,
    public baseline: number | null,
    public unit: string | null,
    public frequency: number | null,
    public annualOccurrences: number | null,
    public progress: number | null,
  ) {}

  static fromMap(data: Record<string, unknown>): ObjectivesDetailsModel {
    const title = (value: unknown): TitleInterface | null => {
      if (!value || typeof value !== 'object') return null
      const item = value as Record<string, unknown>
      const locale = localStorage.getItem('lang') || 'en'
      const titles = Array.isArray(item.titles)
        ? (item.titles as { locale?: string; title?: string }[])
        : []
      return new TitleInterface({
        id: Number(item.id),
        title: String(
          item.title ??
            item.name ??
            titles.find((t) => t.locale === locale)?.title ??
            titles[0]?.title ??
            '',
        ),
      })
    }
    const number = (value: unknown): number | null =>
      value == null || value === '' || !Number.isFinite(Number(value)) ? null : Number(value)
    return new ObjectivesDetailsModel(
      Number(data.id),
      String(data.year ?? ''),
      String(data.objective ?? ''),
      title(data.project),
      Number(data.target_type) as ObjectiveTargetTypeEnum,
      number(data.direction) as ObjectiveDirectionEnum | null,
      title(data.department),
      title(data.follow_up_employee),
      number(data.target),
      number(data.baseline),
      typeof data.unit === 'string' ? data.unit : null,
      number(data.frequency),
      number(data.annual_occurrences),
      number(data.progress),
    )
  }
}
