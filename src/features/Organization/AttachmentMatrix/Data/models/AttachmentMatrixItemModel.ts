export default class AttachmentMatrixItemModel {
  constructor(
    public id: number,
    public url: string,
    public file_name: string,
  ) {}

  /** Compatibility alias for upload components that consume a file URL. */
  get file(): string {
    return this.url
  }

  get fileName(): string {
    return this.file_name
  }

  get alt(): string {
    return this.file_name
  }

  static fromMap(data: unknown): AttachmentMatrixItemModel {
    if (typeof data === 'string') {
      return new AttachmentMatrixItemModel(0, data, data.split('/').pop() ?? '')
    }

    const item = (data ?? {}) as Record<string, unknown>
    const url = String(item.url ?? item.file ?? item.original_url ?? '')

    return new AttachmentMatrixItemModel(
      Number(item.id ?? 0),
      url,
      String(item.file_name ?? item.fileName ?? item.name ?? item.alt ?? url.split('/').pop() ?? ''),
    )
  }

  static empty = new AttachmentMatrixItemModel(0, '', '')
}
