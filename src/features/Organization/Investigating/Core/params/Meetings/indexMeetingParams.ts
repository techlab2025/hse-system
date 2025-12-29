import type Params from '@/base/core/params/params'
import type { Observation } from '../Enums/ObservationTypeEnum'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexMeetingParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
 public isPaginate: boolean = true

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    isPaginate: boolean = true,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.isPaginate = isPaginate

  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word) data['word'] = this.word
   if (this.isPaginate) data['paginate'] = this.withPage
   if (this.isPaginate) data['page'] = this.pageNumber
   if (this.isPaginate) data['limit'] = this.perPage

    // if (this.code) data['code'] = this.code
    return data
  }
}
