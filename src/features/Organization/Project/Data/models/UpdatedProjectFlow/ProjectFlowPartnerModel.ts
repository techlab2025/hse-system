/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ProjectFlowPartnerModel {
  constructor(
    public readonly id?: number,
    public readonly title?: string,
  ) {}

  static fromMap(data: Record<string, any>) {
    return new ProjectFlowPartnerModel(data.id, data.title ?? data.name)
  }
}
