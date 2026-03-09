import type Params from '@/base/core/params/params'

export default class FetchHierarchyCertificatesParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  constructor(word: string, pageNumber: number = 1, perPage: number = 10, withPage: number = 1) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    if (this.word) data['word'] = this.word
    if (this.withPage) data['paginate'] = this.withPage
    if (this.pageNumber) data['page'] = this.pageNumber
    if (this.perPage) data['limit'] = this.perPage
    return data
  }
}
