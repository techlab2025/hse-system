import type Params from '@/base/core/params/params'

export default class IndexOrganizationDocumentsParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 1
  public id?: number
  public date?: string

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    id?: number,
    date?: string,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.id = id
    this.date = date
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.id) data['parent_id'] = this.id
    if (this.date) data['date'] = this.date
    return data
  }
}
