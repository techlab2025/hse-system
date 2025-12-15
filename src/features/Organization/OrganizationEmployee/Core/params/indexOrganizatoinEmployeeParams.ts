import type Params from '@/base/core/params/params'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexOrganizatoinEmployeeParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public heirarchyId?: number
  public projectZoneId?: number

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    heirarchyId?: number,
    projectZoneId?: number,
    // code?: LangEnum,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.heirarchyId = heirarchyId
    this.projectZoneId = projectZoneId
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.heirarchyId) data['hierarchy_id'] = Number(this.heirarchyId)
    if (this.projectZoneId) data['project_zone_id'] = Number(this.projectZoneId)
    // if (this.code) data['code'] = this.code
    return data
  }
}
