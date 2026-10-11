import type Params from '@/base/core/params/params'

export default class FetchAllLeadershipVisitsParams implements Params {
  public word?: string = ''
  public withPage?: number = 1
  public perPage?: number = 10
  public pageNumber?: number = 10
  public projectId?: number | null
  public date?: string | null

  constructor(
    data: {
      word?: string,
      pageNumber?: number
      perPage?: number
      withPage?: number
      projectId?: number
      date?: string
    }

  ) {
    this.pageNumber = data.pageNumber
    this.word = data.word
    this.perPage = data.perPage
    this.withPage = data.withPage
    this.projectId = data.projectId
    this.date = data.date
  }

  toMap(): Record<string, number | string> {
    return {
      word: this.word!,
      paginate: this.withPage!,
      page: this.pageNumber!,
      limit: this.perPage!,
      project_id: this.projectId!,
      date: this.date!

    }
  }
}
