export default class ProjectMeetingHierarchyModel {
  public hieararchyId: number

  constructor(data: { hieararchyId: number }) {
    this.hieararchyId = data.hieararchyId
  }

  static fromMap(data: any): ProjectMeetingHierarchyModel {
    return new ProjectMeetingHierarchyModel({
      hieararchyId: data.hieararchy_id,
    })
  }

  static example: ProjectMeetingHierarchyModel = new ProjectMeetingHierarchyModel({
    hieararchyId: 11,
  })
}
