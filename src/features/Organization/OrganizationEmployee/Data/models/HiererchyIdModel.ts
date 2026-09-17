export default class HierarchyIdModel {
  public hierarchyId: number

  constructor(hierarchyId: number) {
    this.hierarchyId = hierarchyId
  }

  static fromMap(data: any): HierarchyIdModel {
    return new HierarchyIdModel(data.hierarchy_id)
  }
}
