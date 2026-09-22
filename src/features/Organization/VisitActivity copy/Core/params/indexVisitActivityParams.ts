import type Params from '@/base/core/params/params'

export default class IndexVisitActivityParams implements Params {
  constructor(
    public word: string,
    public pageNumber: number = 1,
    public perPage: number = 10,
    public withPage: number = 1,
  ) {}

  toMap(): Record<string, string | number> {
    const data: Record<string, string | number> = {
      paginate: this.withPage,
      page: this.pageNumber,
      limit: this.perPage,
    }

    if (this.word) data.word = this.word
    return data
  }
}
