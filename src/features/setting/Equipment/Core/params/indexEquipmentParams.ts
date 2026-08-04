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
  public zoonId: number | undefined
  public date?: string
  public status?: number
  public equipmentTypeId?: number
  public equipmentType?: number
  // public code?: LangEnum

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    id?: number,
    // code?: LangEnum,
    isPaginate: boolean = false,
    zoonId: number | undefined = undefined,
    date?: string,
    status?: number,
    equipmentTypeId?: number,
    equipmentType?: number,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.id = id
    this.isPaginate = isPaginate
    this.zoonId = zoonId
    this.date = date
    this.status = status
    this.equipmentTypeId = equipmentTypeId
    this.equipmentType = equipmentType
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word && this.isPaginate) data['word'] = this.word
    if (this.isPaginate) data['paginate'] = this.withPage
    if (this.isPaginate) data['page'] = this.pageNumber
    if (this.isPaginate) data['limit'] = this.perPage
    if (this.id && this.isPaginate) data['parent_id'] = this.id
    if (this.zoonId) data['project_zoon_id'] = this.zoonId
    if (this.date) data['date'] = this.date
    if (this.status != null) data['status'] = this.status
    if (this.equipmentTypeId != null) data['equipment_type_id'] = this.equipmentTypeId
    if (this.equipmentType != null) data['equipment_type'] = this.equipmentType
    // if (this.code) data['code'] = this.code
    return data
  }
}
