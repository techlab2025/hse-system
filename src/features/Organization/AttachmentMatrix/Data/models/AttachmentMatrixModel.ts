import AttachmentMatrixItemModel from './AttachmentMatrixItemModel'

export default class AttachmentMatrixModel {
  constructor(
    public hse_policy: AttachmentMatrixItemModel[],
    public sos: AttachmentMatrixItemModel[],
    public standerd_policy: AttachmentMatrixItemModel[],
  ) {}

  static fromMap(data: Record<string, unknown>): AttachmentMatrixModel {
    const parseItems = (items: unknown): AttachmentMatrixItemModel[] =>
      Array.isArray(items) ? items.map((item) => AttachmentMatrixItemModel.fromMap(item)) : []

    return new AttachmentMatrixModel(parseItems(data.x), parseItems(data.y), parseItems(data.z))
  }

  static empty = new AttachmentMatrixModel([], [], [])
}
