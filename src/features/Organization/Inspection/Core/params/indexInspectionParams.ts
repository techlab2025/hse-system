import type Params from '@/base/core/params/params'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexInspectionParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public id?: number[]
  public zoneIds?: number[]
  // public code?: LangEnum

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    id?: number[],
    zoneIds?: number[],
    // code?: LangEnum,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.id = id
    this.zoneIds = zoneIds
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.id) data['employee_ids'] = this.id
    if (this.zoneIds) data['zone_ids'] = this.zoneIds
    // if (this.code) data['code'] = this.code
    return data
  }
}
