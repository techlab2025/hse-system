import type Params from '@/base/core/params/params'

export default class FetchHierarchyCertificatesParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public hierarchyId ?:number
  constructor(word: string, pageNumber: number = 1, perPage: number = 10, withPage: number = 1 , hierarchyId?:number) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.hierarchyId = hierarchyId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    if (this.word) data['word'] = this.word
    if (this.withPage) data['paginate'] = this.withPage
    if (this.pageNumber) data['page'] = this.pageNumber
    if (this.perPage) data['limit'] = this.perPage
    if (this.hierarchyId) data['hierarchy_id'] = this.hierarchyId

    return data
  }
}
