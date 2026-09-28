export class AttachmentMatrixItemModel {
  constructor(
    public alt: string,
    public file: string,
  ) {}

  static fromMap(data: unknown): AttachmentMatrixItemModel {
    if (typeof data === 'string') {
      return new AttachmentMatrixItemModel('', data)
    }

    const item = (data ?? {}) as Record<string, unknown>
    return new AttachmentMatrixItemModel(String(item.alt ?? ''), String(item.file ?? ''))
  }
}

export default class AttachmentMatrixModel {
  constructor(
    public x: AttachmentMatrixItemModel[],
    public y: AttachmentMatrixItemModel[],
    public z: AttachmentMatrixItemModel[],
  ) {}

  static fromMap(data: Record<string, unknown>): AttachmentMatrixModel {
    const parseItems = (items: unknown): AttachmentMatrixItemModel[] =>
      Array.isArray(items) ? items.map((item) => AttachmentMatrixItemModel.fromMap(item)) : []

    return new AttachmentMatrixModel(parseItems(data.x), parseItems(data.y), parseItems(data.z))
  }

  static empty = new AttachmentMatrixModel([], [], [])
}
