export default class PermitAuditCertificateModel {
  constructor(
    public id: number,
    public title: string,
    public name: string,
    public status: number | null,
    public expiryDate: string,
  ) {}

  static fromMap(data: any): PermitAuditCertificateModel {
    return new PermitAuditCertificateModel(
      Number(data?.id ?? 0),
      data?.title ?? '',
      data?.name ?? '',
      data?.status ?? null,
      data?.expiry_date ?? data?.expiryDate ?? '',
    )
  }
}
