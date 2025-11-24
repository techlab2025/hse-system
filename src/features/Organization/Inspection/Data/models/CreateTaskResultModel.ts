export default class CreateTaskAmswerModel {
  public projectZoonId: number
  public projectLocationId: number
  public id: number
  public title: string
  public projectZoonEquipments: []
  constructor(
    projectZoonId: number,
    projectLocationId: number,
    id: number,
    title: string,
    projectZoonEquipments: [],
  ) {
    this.projectZoonId = projectZoonId
    this.projectLocationId = projectLocationId
    this.id = id
    this.title = title
    this.projectZoonEquipments = projectZoonEquipments
  }

  static fromMap(data: any): CreateTaskAmswerModel {
    return new CreateTaskAmswerModel(
      data.project_zoon_id,
      data.project_location_id,
      data.zoon_id,
      data.zoon_title,
      data.project_zoon_equipments,
    )
  }
}
