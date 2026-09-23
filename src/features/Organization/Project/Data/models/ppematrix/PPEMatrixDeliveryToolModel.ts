export default class PPEMatrixDeliveryToolModel {
  constructor(
    public id: number,
    public title: string,
    public isDelivery: boolean,
  ) {}

  static fromMap(data: unknown): PPEMatrixDeliveryToolModel {
    if (!data || typeof data !== 'object') return new PPEMatrixDeliveryToolModel(0, '', false)

    const item = data as Record<string, unknown>
    const deliveryValue = item.is_delivery ?? item.is_deleviry ?? item.is_delivered ?? false

    return new PPEMatrixDeliveryToolModel(
      Number(item.id ?? item.ppe_tool_id ?? 0),
      String(item.title ?? ''),
      deliveryValue === true || deliveryValue === 1 || deliveryValue === '1',
    )
  }
}
