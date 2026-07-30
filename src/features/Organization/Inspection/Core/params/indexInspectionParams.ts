import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexInspectionParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public id?: number[]
  public zoneIds?: number[]
  public isOverDue?: boolean
  public projectIds?: number | number[]
  public taskId?: number
  public inspectionType?: number
  public date?: string

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    id?: number[],
    zoneIds?: number[],
    isOverDue?: boolean,
    projectIds?: number | number[],
    taskId?: number,
    inspectionType?: number,
    date?: string,
    // code?: LangEnum,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.id = id
    this.zoneIds = zoneIds
    this.isOverDue = isOverDue
    this.projectIds = projectIds
    this.taskId = taskId
    this.inspectionType = inspectionType
    this.date = date
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null | any> {
    const data: Record<string, string | number | number[] | null | any> = {}
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

    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.id) data['employee_ids'] = this.id
    if (this.zoneIds) data['zone_ids'] = this.zoneIds
    if (this.isOverDue) data['is_over_due'] = this.isOverDue
    if (projectIds.length > 0) data['project_ids'] = projectIds
    if (this.taskId) data['task_id'] = this.taskId
    if (this.inspectionType != null) data['inspection_type'] = this.inspectionType
    if (this.date) data['date'] = this.date
    // if (this.code) data['code'] = this.code
    return data
  }
}
