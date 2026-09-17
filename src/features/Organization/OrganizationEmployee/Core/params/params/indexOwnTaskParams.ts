import type Params from '@/base/core/params/params'

export default class IndexOwnTaskParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public type?: number 

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    type?: number,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.type = type
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | boolean | null> {
    const data: Record<string, string | number | number[] | boolean | null> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.type != null) data['type'] = Number(this.type)
    // if (this.code) data['code'] = this.code
    return data
  }
}
