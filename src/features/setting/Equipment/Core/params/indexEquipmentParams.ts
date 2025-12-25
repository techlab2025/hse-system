import type Params from '@/base/core/params/params'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexEquipmentParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public id?: number
  public isPaginate: boolean = false
  // public code?: LangEnum

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    id?: number,
    // code?: LangEnum,
    isPaginate: boolean = false
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.id = id
    this.isPaginate = isPaginate
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word && this.isPaginate) data['word'] = this.word
    if(this.isPaginate) data['paginate'] = this.withPage
    if(this.isPaginate) data['page'] = this.pageNumber
    if(this.isPaginate) data['limit'] = this.perPage
    if (this.id && this.isPaginate) data['parent_id'] = this.id
    // if (this.code) data['code'] = this.code
    return data
  }
}
