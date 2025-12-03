export default class MyZonesModel {
  public ProjectZoneId: number
  public projectLocationId: number
  public id: number
  public title: string

  constructor(ProjectZoneId: number, projectLocationId: number, id: number, title: string) {
    this.ProjectZoneId = ProjectZoneId
    this.projectLocationId = projectLocationId
    this.id = id
    this.title = title
  }

  static fromMap(data: any): MyZonesModel {
    return new MyZonesModel(
      data.project_zoon_id,
      data.project_location_id,
      data.zoon_id,
      data.zoon_title,
    )
  }
}
