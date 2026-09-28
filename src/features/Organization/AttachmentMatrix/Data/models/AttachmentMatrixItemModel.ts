export default class AttachmentMatrixItemModel {
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
