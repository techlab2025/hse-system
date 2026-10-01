import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { CertificateTypeEnum } from '../Enums/CertificateTypeEnum'

export default class EditOrganizationCertificateParams implements Params {
  id: number
  translation: TranslationsParams
  // hasCertificate: number
  allIndustries: number | null
  industries: number[]
  // parentId: number
  image: string | null
  imageId?: number
  require_expired_date?: boolean
  certificate_type?: number
  hasrequiredata?: boolean
  type: CertificateTypeEnum

  constructor(
    id: number,
    translation: TranslationsParams,
    // hasCertificate: number,
    allIndustries: number | null,
    industries: number[],
    // parentId: number,
    image: string | null,
    imageId?: number,
    require_expired_date?: boolean,
    certificate_type?: number,
    hasrequiredata?: boolean,
    type: CertificateTypeEnum = CertificateTypeEnum.CERTIFICATE,
  ) {
    this.id = id
    this.translation = translation
    // this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    // this.parentId = parentId
    this.image = image
    this.imageId = imageId
    this.require_expired_date = require_expired_date
    this.certificate_type = certificate_type
    this.hasrequiredata = hasrequiredata
    this.type = type === CertificateTypeEnum.CERTIFICATE ? type : CertificateTypeEnum.CERTIFICATE
  }

  toMap(): Record<
    string,
    | number
    | string
    | number[]
    | boolean
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

    data['certificate_id'] = this.id
    data['translations'] = this.translation.toMap()
    // data['has_certificate'] = this.hasCertificate ? 1 : 0
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
    // if (this.parentId) data['parent_id'] = this.parentId
    if (this.image != null) data['image'] = this.image
    if (this.imageId) data['image_id'] = this.imageId

    if (this.require_expired_date !== undefined) data['require_expired_date'] = this.require_expired_date
    if (this.certificate_type) data['certificate_type'] = this.certificate_type
    if (this.hasrequiredata !== undefined) data['require_certificate'] = this.hasrequiredata
    data['type'] = this.type
    return data
  }
}
