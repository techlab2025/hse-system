import type Params from '@/base/core/params/params'
import type { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexTicketTypeParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public id?: number
  public type?: EquipmentTypesEnum
  // public code?: LangEnum

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    id?: number,
    type?: EquipmentTypesEnum,
    // code?: LangEnum,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.id = id
    this.type = type
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word) data['word'] = this.word
    if (this.pageNumber) data['page'] = this.pageNumber
    if (this.withPage) data['paginate'] = this.withPage
    if (this.perPage) data['limit'] = this.perPage
    if (this.id) data['parent_id'] = this.id
    if (this.type) data['type'] = `${this.type}`
    // if (this.code) data['code'] = this.code
    return data
  }
}
