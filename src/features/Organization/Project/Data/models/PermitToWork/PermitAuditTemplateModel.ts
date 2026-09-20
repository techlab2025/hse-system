import PermitAuditTemplateItemModel from './PermitAuditTemplateItemModel'
import PermitAuditTemplateItemTagModel from './PermitAuditTemplateItemTagModel'

export default class PermitAuditTemplateModel {
  constructor(
    public id: number,
    public templateId: number,
    public organizationId: number,
    public type: number,
    public isInLibrary: boolean,
    public title: string,
    public templateItemTags: PermitAuditTemplateItemTagModel[],
    public templateItems: PermitAuditTemplateItemModel[],
  ) {}

  static fromMap(data: any): PermitAuditTemplateModel {
    return new PermitAuditTemplateModel(
      Number(data?.id ?? 0),
      Number(data?.template_id ?? data?.id ?? 0),
      Number(data?.organization_id ?? 0),
      Number(data?.type ?? 0),
      data?.is_in_library === true || Number(data?.is_in_library) === 1,
      data?.title ?? '',
      (data?.template_item_tags ?? []).map((item: any) =>
        PermitAuditTemplateItemTagModel.fromMap(item),
      ),
      (data?.template_items ?? []).map((item: any) => PermitAuditTemplateItemModel.fromMap(item)),
    )
  }
}
