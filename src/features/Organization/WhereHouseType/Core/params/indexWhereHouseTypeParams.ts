import type Params from '@/base/core/params/params'

export default class IndexWhereHouseTypeParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public isPaginate: boolean

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    isPaginate: boolean = false,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.isPaginate = isPaginate
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word && !this.isPaginate) data['word'] = this.word
    if (!this.isPaginate) data['paginate'] = this.withPage
    if (!this.isPaginate) data['page'] = this.pageNumber
    if (!this.isPaginate) data['limit'] = this.perPage
    return data
  }
}
