import PermitAuditTemplateItemOptionModel from './PermitAuditTemplateItemOptionModel'

export default class PermitAuditResultItemOptionModel {
  constructor(
    public id: number,
    public permitToWorkResultItemOptionId: number,
    public permitToWorkResultItemId: number,
    public answer: string,
    public templateItemOptionId: number,
    public templateItemOption: PermitAuditTemplateItemOptionModel | null,
  ) {}

  static fromMap(data: any): PermitAuditResultItemOptionModel {
    const nestedOption = data?.template_item_option ?? data?.option ?? (data?.title ? data : null)

    return new PermitAuditResultItemOptionModel(
      Number(data?.id ?? 0),
      Number(data?.permit_to_work_result_item_option_id ?? data?.id ?? 0),
      Number(data?.permit_to_work_result_item_id ?? 0),
      data?.answer ?? data?.result ?? '',
      Number(data?.template_item_option_id ?? data?.option_id ?? nestedOption?.id ?? 0),
      nestedOption ? PermitAuditTemplateItemOptionModel.fromMap(nestedOption) : null,
    )
  }
}
