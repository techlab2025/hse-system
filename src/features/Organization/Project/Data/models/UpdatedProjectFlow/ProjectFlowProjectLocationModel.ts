/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ProjectFlowProjectLocationModel {
  constructor(
    public readonly projectLocationId: number,
    public readonly projectId: number,
    public readonly locationId: number,
    public readonly locationTitle: string,
  ) {}

  static fromMap(data: Record<string, any>) {
    return new ProjectFlowProjectLocationModel(
      data.project_location_id,
      data.project_id,
      data.location_id,
      data.location_title ?? '',
    )
  }
}
