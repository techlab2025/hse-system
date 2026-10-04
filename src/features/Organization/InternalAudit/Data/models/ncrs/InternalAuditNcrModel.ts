import TitleInterface from '@/base/Data/Models/title_interface'
import type { NcrCategoryEnum } from '../../../Core/enums/ncrs/NcrCategoryEnum'
import { StatusEnum } from '../../../Core/enums/ncrs/StatusEnum'

export type NcrPerson = {
  id: number
  name: string
}

function parsePerson(value: unknown): NcrPerson {
  const person = (value ?? {}) as Record<string, unknown>
  return { id: Number(person.id ?? 0), name: String(person.name ?? '') }
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
      String(item.area ?? ''),
      parsePerson(item.created_by),
      parsePerson(item.auditee ?? item.audited_employee),
      String(item.due_date ?? ''),
      item.status as StatusEnum,
      parsePerson(leadReview),
      String(
        item.lead_review_status ??
          item.LeadReviewStatus ??
          (typeof leadReview === 'string' ? leadReview : ''),
      ),
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
    ),
  ]
}
