import PermitAuditTemplateItemModel from './PermitAuditTemplateItemModel'

export default class PermitAuditTemplateItemTagModel {
  constructor(
    public id: number,
    public templateItemTagId: number,
    public title: string,
    public templateItems: PermitAuditTemplateItemModel[],
  ) {}

  static fromMap(data: any): PermitAuditTemplateItemTagModel {
    return new PermitAuditTemplateItemTagModel(
      Number(data?.id ?? 0),
      Number(data?.template_item_tag_id ?? data?.id ?? 0),
      data?.title ?? '',
      (data?.template_items ?? []).map((item: any) => PermitAuditTemplateItemModel.fromMap(item)),
    )
  }
}
