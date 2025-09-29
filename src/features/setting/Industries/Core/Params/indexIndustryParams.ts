import type Params from '@/base/core/params/params'

export default class IndexIndustryParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10

  constructor(word: string, withPage: number = 1, perPage: number = 10, pageNumber: number = 10) {
    this.word = word
    this.withPage = withPage
    this.perPage = perPage
    this.pageNumber = pageNumber
  }

  toMap(): Record<string, number | string | Record<string, string>> {
    const data: Record<string, number | string | Record<string, string>> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    return data
  }
}
