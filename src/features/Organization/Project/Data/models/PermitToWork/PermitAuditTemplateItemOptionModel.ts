export default class PermitAuditTemplateItemOptionModel {
  constructor(
    public id: number,
    public templateItemOptionId: number,
    public templateItemId: number,
    public title: string,
    public isDanger: boolean,
    public isUpload: boolean,
    public textareaType: number,
    public hasAutoObservation: boolean,
  ) {}

  static fromMap(data: any): PermitAuditTemplateItemOptionModel {
    return new PermitAuditTemplateItemOptionModel(
      Number(data?.id ?? 0),
      Number(data?.template_item_option_id ?? data?.id ?? 0),
      Number(data?.template_item_id ?? 0),
      data?.title ?? '',
      data?.is_danger === true || Number(data?.is_danger) === 1,
      data?.is_upload === true || Number(data?.is_upload) === 1,
      Number(data?.textarea_type ?? 0),
      data?.has_auto_observation === true || Number(data?.has_auto_observation) === 1,
    )
  }
}
