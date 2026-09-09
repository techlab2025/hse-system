/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ProjectFlowHierarchyModel {
  constructor(
    public readonly projectLocationId: number,
    public readonly hierarchyId: number,
    public readonly hierarchyTitle: string,
    public readonly employees: Record<string, unknown>[],
  ) {}
  static fromMap(data: Record<string, any>) {
    return new ProjectFlowHierarchyModel(
      data.project_location_id,
      data.hierarchy_id,
      data.hierarchy_title ?? data.title ?? '',
      data.project_location_hierarchy_employees ?? data.organizaion_employees ?? [],
    )
  }
}
