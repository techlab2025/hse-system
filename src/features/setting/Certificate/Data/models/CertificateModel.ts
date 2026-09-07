import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class CertificateModel extends TitleInterface {
  public id: number
  public hasCertificate: number
  public allIndustries: number
  public industries: TitleModel<string>[]
  public parentId: number
  public image: string
  public titles: string
  public descriptions: string
  public requireExpiredDate: boolean
  public certificateType: number
  public requireCertificate: boolean
  public createdAt: string

  constructor(
    id: number,
    title: string,
    subtitle: string,
    hasCertificate: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    titles: string,
    descriptions: string,
    requireExpiredDate: boolean,
    certificateType: number,
    requireCertificate: boolean,
    createdAt: string,
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.descriptions = descriptions
    this.requireExpiredDate = requireExpiredDate
    this.certificateType = certificateType
    this.requireCertificate = requireCertificate
    this.createdAt = createdAt
  }

  static fromMap(data: any): CertificateModel {
    return new CertificateModel(
      data.id,
      data.title,
      data.subtitle,
      data.has_certificate,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => TitleModel.fromMap(industry))
        : [],
      data.parent_id,
      data.image,
      data.titles,
      data.descriptions,
      this.toBoolean(data.require_expired_date),
      Number(data.certificate_type?.id ?? data.certificate_type ?? 0),
      this.toBoolean(data.require_certificate),
      data.created_at,
    )
  }

  private static toBoolean(value: unknown): boolean {
    return value === true || value === 1 || value === '1' || value === 'true'
  }
}
