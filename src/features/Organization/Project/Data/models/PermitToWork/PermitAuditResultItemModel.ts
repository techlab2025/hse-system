import PermitAuditMediaModel from './PermitAuditMediaModel'
import PermitAuditResultItemOptionModel from './PermitAuditResultItemOptionModel'
import PermitAuditTemplateItemModel from './PermitAuditTemplateItemModel'

export default class PermitAuditResultItemModel {
  constructor(
    public id: number,
    public permitToWorkResultItemId: number,
    public result: string,
    public templateItemId: number,
    public permitToWorkResultItemOptions: PermitAuditResultItemOptionModel[],
    public templateItemAction: number,
    public media: PermitAuditMediaModel[],
    public templateItem: PermitAuditTemplateItemModel | null,
  ) {}

  static fromMap(data: any): PermitAuditResultItemModel {
    return new PermitAuditResultItemModel(
      Number(data?.id ?? 0),
      Number(data?.permit_to_work_result_item_id ?? data?.id ?? 0),
      data?.result ?? '',
      Number(data?.template_item_id ?? 0),
      (data?.permit_to_work_result_item_options ?? []).map((item: any) =>
        PermitAuditResultItemOptionModel.fromMap(item),
      ),
      Number(data?.template_item_action ?? 0),
      (data?.media ?? []).map((item: any) => PermitAuditMediaModel.fromMap(item)),
      data?.template_item ? PermitAuditTemplateItemModel.fromMap(data.template_item) : null,
    )
  }
}
