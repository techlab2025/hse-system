import PPEMatrixDeliveryToolModel from './PPEMatrixDeliveryToolModel'

export default class PPEMatrixDeliveryActivityModel {
  constructor(
    public id: number,
    public title: string,
    public tools: PPEMatrixDeliveryToolModel[],
  ) {}

  static fromMap(data: unknown): PPEMatrixDeliveryActivityModel {
    if (!data || typeof data !== 'object') return new PPEMatrixDeliveryActivityModel(0, '', [])

    const item = data as Record<string, unknown>
    const activity =
      item.ppe_activity && typeof item.ppe_activity === 'object'
        ? (item.ppe_activity as Record<string, unknown>)
        : item
    const tools = item.tools ?? item.ppe_tools ?? []

    return new PPEMatrixDeliveryActivityModel(
      Number(activity.id ?? item.ppe_activity_id ?? 0),
      String(activity.title ?? item.activity_title ?? ''),
      Array.isArray(tools) ? tools.map(PPEMatrixDeliveryToolModel.fromMap) : [],
    )
  }
}
