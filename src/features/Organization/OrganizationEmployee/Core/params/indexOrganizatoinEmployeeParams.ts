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
  public returndeadonly?: number
  public CertificateId?: number
  public shouldHaveThisCertificate?: boolean
  public shouldNotHaveThisHierarchy?: boolean

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    heirarchyId?: number,
    projectZoneId?: number,
    returndeadonly?: number,
    CertificateId?: number,
    shouldHaveThisCertificate?: boolean,
    shouldNotHaveThisHierarchy?: boolean,
    // code?: LangEnum,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.heirarchyId = heirarchyId
    this.projectZoneId = projectZoneId
    this.returndeadonly = returndeadonly
    this.CertificateId = CertificateId
    this.shouldHaveThisCertificate = shouldHaveThisCertificate
    this.shouldNotHaveThisHierarchy = shouldNotHaveThisHierarchy
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null | any> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.heirarchyId != null) data['hierarchy_id'] = Number(this.heirarchyId)
    if (this.projectZoneId != null) data['project_zone_id'] = Number(this.projectZoneId)
    if (this.returndeadonly != null || this.returndeadonly == false)
      data['not_include_dead_employees'] = this.returndeadonly
    if (this.CertificateId != null) data['certificate_id'] = Number(this.CertificateId)

    if (this.shouldHaveThisCertificate != null || this.shouldHaveThisCertificate == false)
      data['should_have_this_certificate'] = this.shouldHaveThisCertificate

    if (this.shouldNotHaveThisHierarchy != null || this.shouldNotHaveThisHierarchy == false)
      data['should_not_have_this_hierarchy'] = this.shouldNotHaveThisHierarchy

    // if (this.code) data['code'] = this.code
    return data
  }
}
