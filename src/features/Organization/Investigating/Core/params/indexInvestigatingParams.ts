import type Params from '@/base/core/params/params'
import type { Observation } from '../Enums/ObservationTypeEnum'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexHazardParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public type: Observation.HazardType
  public projectId: number | null = null
  // public code?: LangEnum
  public projectZoonIds?: number[]

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    type: Observation.HazardType,
    projectId: number | null = null,
    projectZoonIds?: number[],
    // code?: LangEnum,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.type = type
    this.projectId = projectId
    this.projectZoonIds = projectZoonIds
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.type) data['type'] = [this.type]
    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.projectId)
    if (this.projectZoonIds) data['zoon_ids'] = this.projectZoonIds
    // if (this.code) data['code'] = this.code
    return data
  }
}
