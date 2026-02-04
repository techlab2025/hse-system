import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexHerikalyParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public parentOnly: boolean
  public projectId: number

  // public id?: number
  // public code?: LangEnum

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    parentOnly: boolean,
    projectId: number,
    // id?: number,
    // code?: LangEnum,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.parentOnly = parentOnly
    this.projectId = projectId

    // this.id = id
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null | any> {
    const data: Record<string, string | number | number[] | null | any> = {}
    if (this.word) data['word'] = this.word
    if (this.withPage) data['paginate'] = this.withPage
    if (this.pageNumber) data['page'] = this.pageNumber
    if (this.perPage) data['limit'] = this.perPage
    data['return_patent_only'] = this.parentOnly
    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.projectId)
    // if (this.id) data['parent_id'] = this.id
    // if (this.code) data['code'] = this.code
    return data
  }
}
