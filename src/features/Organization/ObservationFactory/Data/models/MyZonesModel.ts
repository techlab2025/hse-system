
export default class MyZonesModel {
  public projectZoonId: number
  public projectLocationId: number
  public zoonId: number
  public zoonTitle: string

  constructor(projectZoonId: number, projectLocationId: number, zoonId: number, zoonTitle: string) {
    this.projectZoonId = projectZoonId
    this.projectLocationId = projectLocationId
    this.zoonId = zoonId
    this.zoonTitle = zoonTitle
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
