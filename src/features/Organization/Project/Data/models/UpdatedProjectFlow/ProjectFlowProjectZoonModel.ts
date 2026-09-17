/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ProjectFlowProjectZoonModel {
  constructor(
    public readonly projectZoonId: number,
    public readonly projectLocationId: number,
    public readonly projectId: number,
    public readonly zoonId: number,
    public readonly zoonTitle: string,
  ) {}

  static fromMap(data: Record<string, any>) {
    return new ProjectFlowProjectZoonModel(
      data.project_zoon_id,
      data.project_location_id,
      data.project_id,
      data.zoon_id,
      data.zoon_title ?? '',
    )
  }
}
