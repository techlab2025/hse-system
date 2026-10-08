export default class PPEMatrixDeliveryToolModel {
  constructor(
    public id: number,
    public title: string,
    public isDelivery: boolean,
  ) {}

  static fromMap(data: unknown): PPEMatrixDeliveryToolModel {
    if (!data || typeof data !== 'object') return new PPEMatrixDeliveryToolModel(0, '', false)

    const item = data as Record<string, unknown>
    const tool =
      item.ppe_tool && typeof item.ppe_tool === 'object'
        ? (item.ppe_tool as Record<string, unknown>)
        : item
    const deliveryValue = item.is_delivery ?? item.is_deleviry ?? item.is_delivered ?? false

    return new PPEMatrixDeliveryToolModel(
      Number(tool.id ?? item.ppe_tool_id ?? 0),
      String(tool.title ?? ''),
      deliveryValue === true || deliveryValue === 1 || deliveryValue === '1',
    )
  }
}
