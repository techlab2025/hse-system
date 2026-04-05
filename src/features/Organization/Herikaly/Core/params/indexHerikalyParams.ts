import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class IndexHerikalyParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public parentOnly: boolean
  public projectId: number | null

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    parentOnly: boolean,
    projectId: number | null,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.parentOnly = parentOnly
    this.projectId = projectId
  }

  toMap(): Record<string, string | number | number[] | null | any> {
    const data: Record<string, string | number | number[] | null | any> = {}
    if (this.word) data['word'] = this.word
    if (this.withPage) data['paginate'] = this.withPage
    if (this.pageNumber) data['page'] = this.pageNumber
    if (this.perPage) data['limit'] = this.perPage
    data['return_patent_only'] = this.parentOnly
    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.projectId!)

    return data
  }
}
