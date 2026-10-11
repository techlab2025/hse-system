import type { OrganizationCertificateFields } from '../../Core/params/addOrganizationCertificateParams'

export default class OrganizationCertificateDetailsModel implements OrganizationCertificateFields {
  constructor(
    public id: number,
    public certification_name: string,
    public issuing_body: string,
    public certificate_number: string,
    public issue_date: string,
    public hase_expiry_date: boolean,
    public expire_date: string,
    public certificate_file: string,
    public notes: string = '',
  ) {}

  static fromMap(data: any): OrganizationCertificateDetailsModel {
    return new OrganizationCertificateDetailsModel(
      data.id,
      data.certification_name ?? data.title ?? '',
      data.issuing_body ?? '',
      String(data.certificate_number ?? ''),
      data.issue_date ?? '',
      this.toBoolean(data.hase_expiry_date ?? data.has_expiry_date),
      data.expire_date ?? '',
      data.certificate_file ?? '',
      data.notes ?? '',
    )
  }

  static transformData(data: any[]): OrganizationCertificateDetailsModel[] {
    return data.map((item) => this.fromMap(item))
  }

  private static toBoolean(value: unknown): boolean {
    return value === true || value === 1 || value === '1' || value === 'true'
  }
}
