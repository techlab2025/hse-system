import type Params from '@/base/core/params/params'
export default class IndexTraningTopicParams implements Params {
  constructor(
    public word: string = '',
    public withPage: number = 1,
    public perPage: number = 10,
    public pageNumber: number = 1,
    public isPaginate: boolean = true,
    public isSystemOnly?: boolean,
  ) {}

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      word: this.word,
      paginate: this.isPaginate,
      page: this.pageNumber,
      limit: this.perPage,
    }
    if (this.isSystemOnly !== undefined) data.is_system_only = this.isSystemOnly
    return data
  }
}
