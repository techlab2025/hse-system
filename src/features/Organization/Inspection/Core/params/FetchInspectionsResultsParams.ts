import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class FetchInspectionsResultsParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public zoneIds?: number[]
  public projectIds?: number | number[]
  public inspectionType?: number
  public date?: string
  // public id: number

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    zoneIds?: number[],
    projectIds?: number | number[],
    inspectionType?: number,
    date?: string,
    // id: number,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.zoneIds = zoneIds
    this.projectIds = projectIds
    this.inspectionType = inspectionType
    this.date = date
    // this.id = id
  }

  toMap(): Record<string, number | string | number[]> {
    const data: Record<string, number | string | number[]> = {}
    const headerProjectId = Number(useProjectSelectStore().getProjectId())
    const explicitProjectIds = Array.isArray(this.projectIds)
      ? this.projectIds
      : this.projectIds
        ? [this.projectIds]
        : []
    const projectIds =
      explicitProjectIds.length > 0
        ? explicitProjectIds.filter((id) => Number(id) > 0)
        : headerProjectId > 0
          ? [headerProjectId]
          : []

    data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.zoneIds) data['zone_ids'] = this.zoneIds
    if (projectIds.length > 0) data['project_ids'] = projectIds
    if (this.inspectionType != null) data['inspection_type'] = this.inspectionType
    if (this.date) data['date'] = this.date

    // data['task_id'] = this.id
    return data
  }
}
