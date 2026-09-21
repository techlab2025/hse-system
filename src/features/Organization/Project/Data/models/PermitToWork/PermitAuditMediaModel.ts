export default class PermitAuditMediaModel {
  constructor(
    public id: number,
    public fileName: string,
    public url: string,
    public mimeType: string,
  ) {}

  static fromMap(data: any): PermitAuditMediaModel {
    if (typeof data === 'string') return new PermitAuditMediaModel(0, '', data, '')

    return new PermitAuditMediaModel(
      Number(data?.id ?? 0),
      data?.file_name ?? data?.name ?? '',
      data?.url ?? data?.original_url ?? '',
      data?.mime_type ?? data?.mimeType ?? '',
    )
  }
}
