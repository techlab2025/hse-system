import TitleInterface from '@/base/Data/Models/title_interface'
import {
  ObjectiveDirectionEnum,
  ObjectiveTargetTypeEnum,
} from '../../Core/enums/objectivesEnums'

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  return Number(value)
}

const toRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null

const toText = (value: unknown): string => (value === null || value === undefined ? '' : String(value))

const toTitle = (
  value: unknown,
  fallbackId?: unknown,
  fallbackTitle?: unknown,
): TitleInterface | null => {
  const item = toRecord(value)
  const id = item?.id ?? fallbackId
  if (id === null || id === undefined || id === '') return null

  return new TitleInterface({
    id: Number(id),
    title:
      toText(item?.title) ||
      toText(item?.name) ||
      toText(item?.full_name) ||
      toText(item?.employee_name) ||
      (fallbackTitle ? String(fallbackTitle) : String(id)),
  })
}

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
  ) {}

  static fromMap(data: Record<string, unknown>): ObjectivesDetailsModel {
    return new ObjectivesDetailsModel(
      Number(data.id),
      toText(data.year),
      toText(data.objective ?? data.title),
      toTitle(data.project, data.project_id, data.project_title),
      Number(data.target_type ?? data.targetType ?? ObjectiveTargetTypeEnum.Percentage),
      toNullableNumber(data.direction) as ObjectiveDirectionEnum | null,
      toTitle(
        data.department ?? data.hierarchy,
        data.department_id ?? data.hierarchy_id,
        data.department_title ?? data.hierarchy_title,
      ),
      toTitle(
        data.follow_up_employee ?? data.followUpEmployee,
        data.follow_up_employee_id ?? data.followUpEmployeeId,
        data.follow_up_employee_name ?? data.followUpEmployeeName,
      ),
      toNullableNumber(data.target),
      toNullableNumber(data.baseline),
      data.unit ? String(data.unit) : null,
      toNullableNumber(data.frequency),
      toNullableNumber(data.annual_occurrences ?? data.annualOccurrences),
    )
  }
}
