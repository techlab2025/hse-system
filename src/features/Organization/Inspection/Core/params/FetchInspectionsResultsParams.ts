import type Params from '@/base/core/params/params'

export default class FetchInspectionsResultsParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public zoneIds?: number[]
  public projectIds?: number[]
  // public id: number

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    zoneIds?: number[],
    projectIds?: number[],
    // id: number,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.zoneIds = zoneIds
    this.projectIds = projectIds
    // this.id = id
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.zoneIds) data['zone_ids'] = this.zoneIds
    if (this.projectIds) data['project_ids'] = [this.projectIds]

    // data['task_id'] = this.id
    return data
  }
}
