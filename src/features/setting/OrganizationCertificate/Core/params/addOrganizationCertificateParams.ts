import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { CertificateTypeEnum } from '../Enums/CertificateTypeEnum'

export default class AddOrganizationCertificateParams implements Params {
  translation: TranslationsParams
  // hasCertificate: number
  allIndustries: number | null
  industries: number[]
  // parentId: number
  image: string | null
  require_expired_date: boolean
  certificate_type: number
  hasrequiredata: boolean
  type: CertificateTypeEnum

  constructor(
    translation: TranslationsParams,
    // hasCertificate: number,
    allIndustries: number | null,
    industries: number[],
    // parentId: number,
    image: string | null,
    require_expired_date: boolean,
    certificate_type: number,
    hasrequiredata: boolean,
    type: CertificateTypeEnum = CertificateTypeEnum.CERTIFICATE,
  ) {
    this.translation = translation
    // this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    // this.parentId = parentId
    this.image = image
    this.require_expired_date = require_expired_date
    this.certificate_type = certificate_type
    this.hasrequiredata = hasrequiredata
    this.type = type === CertificateTypeEnum.CERTIFICATE ? type : CertificateTypeEnum.CERTIFICATE
  }

  toMap(): Record<
    string,
    | number
    | string
    | boolean
    | number[]
    | Record<string, string | number[] | number | boolean | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | boolean
      | number[]
      | Record<string, string | number[] | number | boolean | Record<string, string>>
    > = {}

    if (this.translation) data['translations'] = this.translation.toMap()
    // data['has_certificate'] = this.hasCertificate ? 1 : 0
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    // console.log(this.allIndustries)
    if (this.industries?.length > 0 && !this.allIndustries) data['industry_ids'] = this.industries
    // if (this.parentId) data['parent_id'] = this.parentId
    if (this.image) data['image'] = this.image
    data['require_expired_date'] = this.require_expired_date
    data['certificate_type'] = this.certificate_type
    data['require_certificate'] = this.hasrequiredata
    data['type'] = this.type
    return data
  }
}
