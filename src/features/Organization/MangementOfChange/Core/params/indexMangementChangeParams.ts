import type Params from '@/base/core/params/params'

export default class IndexMangementChangeParams implements Params {
  constructor(
    public word: string = '',
    public pageNumber: number = 1,
    public perPage: number = 10,
    public withPage: number = 1,
    public projectId: number | null = null,
  ) {}

  toMap(): Record<string, string | number | null> {
    const data: Record<string, string | number | null> = {}

    if (this.word) data.word = this.word
    data.paginate = this.withPage
    data.page = this.pageNumber
    data.limit = this.perPage
    if (this.projectId) data.project_id = this.projectId

    return data
  }
}
