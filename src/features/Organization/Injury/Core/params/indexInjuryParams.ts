import type Params from '@/base/core/params/params'

export default class IndexInjuryParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public isSystemOnly?: boolean

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    isSystemOnly?:boolean,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.isSystemOnly=isSystemOnly
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
   if (this.isSystemOnly || this.isSystemOnly == false) data['is_system_only'] = this.isSystemOnly
    return data
  }
}
