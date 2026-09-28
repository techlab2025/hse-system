import AttachmentMatrixItemModel from './AttachmentMatrixItemModel'

export default class AttachmentMatrixGroupModel {
  constructor(
    public id: number,
    public type: number,
    public creatable_id: number,
    public creatable_type: string,
    public organization_id: number,
    public media: AttachmentMatrixItemModel[],
    public created_at: string,
    public updated_at: string,
  ) {}

  static fromMap(data: unknown): AttachmentMatrixGroupModel {
    if (Array.isArray(data)) {
      return new AttachmentMatrixGroupModel(
        0,
        0,
        0,
        '',
        0,
        data.map((item) => AttachmentMatrixItemModel.fromMap(item)),
        '',
        '',
      )
    }

    const group = (data ?? {}) as Record<string, unknown>
    const media = Array.isArray(group.media)
      ? group.media.map((item) => AttachmentMatrixItemModel.fromMap(item))
      : []

    return new AttachmentMatrixGroupModel(
      Number(group.id ?? 0),
      Number(group.type ?? 0),
      Number(group.creatable_id ?? 0),
      String(group.creatable_type ?? ''),
      Number(group.organization_id ?? 0),
      media,
      String(group.created_at ?? ''),
      String(group.updated_at ?? ''),
    )
  }

  static get empty(): AttachmentMatrixGroupModel {
    return new AttachmentMatrixGroupModel(0, 0, 0, '', 0, [], '', '')
  }
}
