import type Params from '@/base/core/params/params'
import { withProjectIds } from '@/shared/utils/projectScope'

export default class FetchAllTasksParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public zoneIds?: number[]
  public projectIds?: number | number[]
  public inspectionType?: number
  public date?: string
  public isAudit?: boolean

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    zoneIds?: number[],
    projectIds?: number | number[],
    inspectionType?: number,
    date?: string,
    isAudit?: boolean,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.zoneIds = zoneIds
    this.projectIds = projectIds
    this.inspectionType = inspectionType
    this.date = date
    this.isAudit = isAudit
  }

  toMap(): Record<string, string | number | number[] | null | any> {
    const data: Record<string, string | number | number[] | null | any> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.zoneIds) data['zone_ids'] = this.zoneIds
    if (this.inspectionType != null) data['inspection_type'] = this.inspectionType
    if (this.date) data['date'] = this.date
    if (this.isAudit) data['is_audit'] = this.isAudit

    return withProjectIds(data, this.projectIds)
  }
}
