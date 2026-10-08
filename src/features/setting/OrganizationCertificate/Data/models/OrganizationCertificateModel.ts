import OrganizationCertificateDetailsModel from './OrganizationCertificateDetailsModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
import type { CertificateTypeEnum } from '../../Core/Enums/CertificateTypeEnum'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class OrganizationCertificateModel extends TitleInterface {
  public certification_name: string = ''
  public issuing_body: string = ''
  public certificate_number: string = ''
  public issue_date: string = ''
  public hase_expiry_date: boolean = false
  public expire_date: string = ''
  public certificate_file: string = ''
  public notes: string = ''
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
  public hasrequiredata: boolean
  public createdAt: string
  public type: CertificateTypeEnum

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
    hasrequiredata: boolean,
    createdAt: string,
    type: CertificateTypeEnum,
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
    this.hasrequiredata = hasrequiredata
    this.createdAt = createdAt
    this.type = type
  }

  static fromMap(data: any): OrganizationCertificateModel {
    const model = new OrganizationCertificateModel(
      data.id,
      data.certification_name ?? data.title,
      data.subtitle,
      data.has_certificate,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry: Record<string, unknown>) => TitleModel.fromMap(industry))
        : [],
      data.parent_id,
      data.certificate_file ?? data.image,
      data.titles,
      data.descriptions,
      this.toBoolean(data.hase_expiry_date ?? data.has_expiry_date ?? data.require_expired_date),
      Number(data.certificate_type?.id ?? data.certificate_type ?? 0),
      this.toBoolean(data.hasrequiredata ?? data.has_require_data ?? data.require_certificate),
      data.created_at,
      data.type,
    )
    return Object.assign(model, OrganizationCertificateDetailsModel.fromMap(data))
  }

  private static toBoolean(value: unknown): boolean {
    return value === true || value === 1 || value === '1' || value === 'true'
  }
}
