import type Params from '@/base/core/params/params'

export default class IndexNotificationPlanParams implements Params {
  public word: string
  public withPage: number = 1
  public pageNumber: number = 1
  public perPage: number = 10
  public isActive?: boolean

  constructor(
    word: string,
    perPage: number = 10,
    pageNumber: number = 1,
    withPage: number = 1,
    isActive?: boolean,
  ) {
    this.word = word
    this.withPage = withPage
    this.perPage = perPage
    this.pageNumber = pageNumber
    this.isActive = isActive
  }

  toMap(): Record<string, string | number | number[] | boolean | null> {
    const data: Record<string, string | number | number[] | boolean | null> = {}
    data['word'] = this.word
    data['paginate'] = this.withPage
    data['limit'] = this.perPage
    data['page'] = this.pageNumber
    if (this.isActive !== undefined) {
      data['is_active'] = this.isActive
    }
    return data
  }
}
