export default class PermitAuditIndustryModel {
  constructor(
    public id: number,
    public title: string,
  ) {}

  static fromMap(data: any): PermitAuditIndustryModel {
    return new PermitAuditIndustryModel(Number(data?.id ?? 0), data?.title ?? data?.name ?? '')
  }
}
