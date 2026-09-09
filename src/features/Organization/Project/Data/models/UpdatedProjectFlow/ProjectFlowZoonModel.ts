/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ProjectFlowZoonModel {
  constructor(
    public readonly id: number,
    public readonly zoneId: number,
    public readonly title: string,
  ) {}

  static fromMap(data: Record<string, any>) {
    return new ProjectFlowZoonModel(data.id, data.zone_id, data.title ?? '')
  }
}
