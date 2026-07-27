import type Params from '@/base/core/params/params'

export default class FetchTaskReportParams implements Params {
  constructor(
    public word: string = '',
    public pageNumber: number = 1,
    public perPage: number = 10,
    public withPage: number = 1,
    public status: string | number | null = null,
    public fromDate: string = '',
    public toDate: string = '',
  ) {}

  toMap(): Record<string, string | number> {
    const data: Record<string, string | number> = {
      paginate: this.withPage,
      page: this.pageNumber,
      limit: this.perPage,
    }

    if (this.word.trim()) data.word = this.word.trim()
    if (this.status !== null && this.status !== '' && this.status !== 'all') data.status = this.status
    if (this.fromDate?.trim()) data.from_date = this.fromDate.trim()
    if (this.toDate?.trim()) data.to_date = this.toDate.trim()

    return data
  }
}
