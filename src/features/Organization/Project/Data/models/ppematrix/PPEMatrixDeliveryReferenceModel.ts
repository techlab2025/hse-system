export default class PPEMatrixDeliveryReferenceModel {
  constructor(
    public id: number,
    public title: string,
  ) {}

  static fromMap(data: unknown): PPEMatrixDeliveryReferenceModel {
    if (!data || typeof data !== 'object') return new PPEMatrixDeliveryReferenceModel(0, '')

    const item = data as Record<string, unknown>
    return new PPEMatrixDeliveryReferenceModel(
      Number(item.id ?? 0),
      String(item.title ?? item.name ?? ''),
    )
  }
}
