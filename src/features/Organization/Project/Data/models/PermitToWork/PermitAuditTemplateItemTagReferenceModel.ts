export default class PermitAuditTemplateItemTagReferenceModel {
  constructor(
    public id: number,
    public templateItemTagId: number,
    public title: string,
  ) {}

  static fromMap(data: any): PermitAuditTemplateItemTagReferenceModel {
    return new PermitAuditTemplateItemTagReferenceModel(
      Number(data?.id ?? 0),
      Number(data?.template_item_tag_id ?? data?.id ?? 0),
      data?.title ?? '',
    )
  }
}
