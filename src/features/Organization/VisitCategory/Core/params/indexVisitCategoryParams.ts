import type Params from '@/base/core/params/params'

export default class IndexVisitCategoryParams implements Params {
  constructor(
    public word: string,
    public pageNumber: number = 1,
    public perPage: number = 10,
    public withPage: number = 1,
    public isSystemOnly?: boolean,
  ) {}

  toMap(): Record<string, string | number | boolean> {
    const data: Record<string, string | number | boolean> = {
      paginate: this.withPage,
      page: this.pageNumber,
      limit: this.perPage,
    }
    if (this.word) data.word = this.word
    if (typeof this.isSystemOnly === 'boolean') data.is_system_only = this.isSystemOnly
    return data
  }
}
