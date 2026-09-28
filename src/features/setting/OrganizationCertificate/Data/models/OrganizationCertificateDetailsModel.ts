// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type { CertificateTypeEnum } from '../../Core/Enums/CertificateTypeEnum'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class OrganizationCertificateDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public hasCertificate: number
  public allIndustries: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]
  public requireExpiredDate: boolean
  public certificateType: TitleInterface
  public hasrequiredata: boolean
  public type: CertificateTypeEnum

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    hasCertificate: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    requireExpiredDate: boolean,
    certificateType: TitleInterface,
    hasrequiredata: boolean,
    type: CertificateTypeEnum,
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.requireExpiredDate = requireExpiredDate
    this.certificateType = certificateType
    this.hasrequiredata = hasrequiredata
    this.type = type
  }

  static fromMap(data: any): OrganizationCertificateDetailsModel {
    return new OrganizationCertificateDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], data.descriptions, []).descriptions,
      data.has_certificate,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry: Record<string, unknown>) => this.getTitle(industry))
        : [],
      data.parent_id,
      data.image,
      data.require_expired_date,
      this.getTitle(data.certificate_type),
      this.toBoolean(data.hasrequiredata ?? data.has_require_data ?? data.require_certificate),
      data.type,
    )
  }

  static transformData(data: any[]): OrganizationCertificateDetailsModel[] {
    return data.map((item) => this.fromMap(item))
  }

  private static toBoolean(value: unknown): boolean {
    return value === true || value === 1 || value === '1' || value === 'true'
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    if (typeof data === 'number') {
      return new TitleInterface({ id: data })
    }

    return new TitleInterface({
      id: data?.id ?? 0,
      title: data?.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
