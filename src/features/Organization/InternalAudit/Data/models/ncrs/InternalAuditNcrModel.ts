import TitleInterface from '@/base/Data/Models/title_interface'
import type { NcrCategoryEnum } from '../../../Core/enums/ncrs/NcrCategoryEnum'
import { StatusEnum } from '../../../Core/enums/ncrs/StatusEnum'

export type NcrPerson = {
  id: number
  name: string
}

function parsePerson(value: unknown): NcrPerson {
  const person = (value ?? {}) as Record<string, unknown>
  return {
    id: Number(person.id ?? person.organization_employee_id ?? 0),
    name: String(person.name ?? person.title ?? ''),
  }
}

function parseArea(data: Record<string, unknown>): string {
  const directArea = data.area_under_review as Record<string, unknown> | undefined
  if (directArea?.title) return String(directArea.title)

  if (Array.isArray(data.area_under_reviews)) {
    return data.area_under_reviews
      .map((entry) => {
        const review = (entry ?? {}) as Record<string, unknown>
        const area = (review.area_under_review ?? review) as Record<string, unknown>
        return String(area.title ?? '')
      })
      .filter(Boolean)
      .join(', ')
  }

  return String(data.area ?? '')
}

export default class InternalAuditNcrModel extends TitleInterface {
  constructor(
    public id: number,
    public ncr: string,
    public ncrsCategory: NcrCategoryEnum | number | string,
    public area: string,
    public createdBy: NcrPerson,
    public auditee: NcrPerson,
    public dueDate: string,
    public status: StatusEnum,
    public leadReview: NcrPerson,
    public leadReviewStatus: string,
    public serial_name: string = '',
    public serial_number: string = '',
    public createdAt: string = '',
  ) {
    super({ id, title: ncr || area })
  }

  get LeadReview(): NcrPerson {
    return this.leadReview
  }

  static fromMap(data: unknown): InternalAuditNcrModel {
    const item = (data ?? {}) as Record<string, unknown>
    const leadReview = item.LeadReview ?? item.lead_review
    return new InternalAuditNcrModel(
      Number(item.id ?? item.ncr_id ?? 0),
      String(item.ncr ?? ''),
      (item.ncrs_category ?? item.ncr_category ?? item.category ?? '') as
        | NcrCategoryEnum
        | number
        | string,
      parseArea(item),
      parsePerson(item.created_by ?? item.cerated_by),
      parsePerson(item.auditee ?? item.audited_employee),
      String(item.due_date ?? ''),
      item.status as StatusEnum,
      parsePerson(leadReview),
      String(
        item.lead_review_status ??
          item.LeadReviewStatus ??
          (typeof leadReview === 'string' ? leadReview : ''),
      ),
      String(item.serial_name ?? ''),
      String(item.serial_number ?? ''),
      String(item.created_at ?? ''),
    )
  }

  static example: InternalAuditNcrModel[] = [
    new InternalAuditNcrModel(
      1,
      'NCR-2026-001',
      1,
      'Maintenance Workshop',
      { id: 101, name: 'Sara Ibrahim' },
      { id: 104, name: 'Mona Adel' },
      '2026-10-18',
      StatusEnum.OPEN,
      { id: 102, name: 'Ahmed Hassan' },
      'Pending',
      'NCR-2026-001',
      '001',
      '2026-10-04T13:15:20.000000Z',
    ),
    new InternalAuditNcrModel(
      2,
      'NCR-2026-002',
      2,
      'Calibration Records',
      { id: 103, name: 'Mona Ali' },
      { id: 105, name: 'Omar Khaled' },
      '2026-10-22',
      StatusEnum.IN_PROGRESS,
      { id: 101, name: 'Sara Ibrahim' },
      'Reviewed',
      'NCR-2026-002',
      '002',
      '2026-10-05T09:30:00.000000Z',
    ),
  ]
}
