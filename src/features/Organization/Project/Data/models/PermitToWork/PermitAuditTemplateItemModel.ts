import PermitAuditIndustryModel from './PermitAuditIndustryModel'
import PermitAuditTemplateItemOptionModel from './PermitAuditTemplateItemOptionModel'
import PermitAuditTemplateItemTagReferenceModel from './PermitAuditTemplateItemTagReferenceModel'

export default class PermitAuditTemplateItemModel {
  constructor(
    public id: number,
    public templateItemId: number,
    public templateId: number,
    public name: string,
    public allIndustries: boolean,
    public industries: PermitAuditIndustryModel[],
    public action: number,
    public requireImage: boolean,
    public options: PermitAuditTemplateItemOptionModel[],
    public templateItemTag: PermitAuditTemplateItemTagReferenceModel | null,
  ) {}

  static fromMap(data: any): PermitAuditTemplateItemModel {
    return new PermitAuditTemplateItemModel(
      Number(data?.id ?? 0),
      Number(data?.template_item_id ?? data?.id ?? 0),
      Number(data?.template_id ?? 0),
      data?.name ?? '',
      data?.all_industries === true || Number(data?.all_industries) === 1,
      (data?.industries ?? []).map((item: any) => PermitAuditIndustryModel.fromMap(item)),
      Number(data?.action ?? 0),
      data?.require_image === true || Number(data?.require_image) === 1,
      (data?.options ?? []).map((item: any) => PermitAuditTemplateItemOptionModel.fromMap(item)),
      data?.template_item_tag
        ? PermitAuditTemplateItemTagReferenceModel.fromMap(data.template_item_tag)
        : null,
    )
  }
}
