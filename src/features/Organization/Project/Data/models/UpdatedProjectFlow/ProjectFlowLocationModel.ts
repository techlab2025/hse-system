/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ProjectFlowLocationModel {
  constructor(
    public readonly id: number,
    public readonly locationId: number,
    public readonly title: string,
    public readonly code: string,
    public readonly parentId: number | null,
    public readonly type: number,
    public readonly status: number,
    public readonly image: string,
    public readonly parent: ProjectFlowLocationModel | null,
  ) {}

  static fromMap(data: Record<string, any>): ProjectFlowLocationModel {
    return new ProjectFlowLocationModel(
      data.id,
      data.location_id,
      data.title ?? '',
      data.code ?? '',
      data.parent_id ?? null,
      data.type,
      data.status,
      data.image ?? '',
      data.parent ? ProjectFlowLocationModel.fromMap(data.parent) : null,
    )
  }
}
