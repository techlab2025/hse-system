import PermitAuditCreatorModel from './PermitAuditCreatorModel'
import PermitAuditResultItemModel from './PermitAuditResultItemModel'
import PermitAuditTemplateModel from './PermitAuditTemplateModel'

export default class PermitAuditResultModel {
  constructor(
    public id: number,
    public permitToWorkResultId: number,
    public permitToWorkId: number,
    public templateId: number,
    public date: string,
    public time: string,
    public createdAt: string,
    public status: number,
    public createdBy: PermitAuditCreatorModel | null,
    public answers: PermitAuditResultItemModel[],
    public template: PermitAuditTemplateModel | null,
  ) {}

  static fromMap(data: any): PermitAuditResultModel {
    return new PermitAuditResultModel(
      Number(data?.id ?? 0),
      Number(data?.permit_to_work_result_id ?? data?.id ?? 0),
      Number(data?.permit_to_work_id ?? 0),
      Number(data?.template_id ?? 0),
      data?.date ?? '',
      data?.time ?? '',
      data?.created_at ?? '',
      Number(data?.status ?? 0),
      data?.created_by ? PermitAuditCreatorModel.fromMap(data.created_by) : null,
      (data?.permit_to_work_result_items ?? []).map((item: any) =>
        PermitAuditResultItemModel.fromMap(item),
      ),
      data?.template ? PermitAuditTemplateModel.fromMap(data.template) : null,
    )
  }
}
