import type Params from '@/base/core/params/params'
import type { ParentTypeEnum } from '../enums/parenttypeenum'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexCatalogItemsParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public id?: number
     public parentType?: ParentTypeEnum
  
  // public code?: LangEnum

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    id?: number,
    parentType?: ParentTypeEnum,
    // code?: LangEnum,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.id = id
    this.parentType = parentType
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.id) data['parent_id'] = this.id
    if (this.parentType) data['parent_type'] = this.parentType
    // if (this.code) data['code'] = this.code
    return data
  }
}
