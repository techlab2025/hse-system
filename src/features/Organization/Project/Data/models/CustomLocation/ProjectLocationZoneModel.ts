import TitleModel from '@/base/core/Models/title_model'

export default class ProjectLocationZoneModel extends TitleModel {
  public projectLocationId: number
  public zoonId: number
  public projectZoonEquipments: []

  constructor(
    id: number,
    title: string,
    projectLocationId: number,
    zoonId: number,
    projectZoonEquipments: [],
  ) {
    super(title, id)
    this.projectLocationId = projectLocationId
    this.zoonId = zoonId
    this.projectZoonEquipments = projectZoonEquipments
  }

  static fromMap(data: any): ProjectLocationZoneModel {
    return new ProjectLocationZoneModel(
      data.project_zoon_id,
      data.title,
      data.project_location_id,
      data.zoon_id,
      data.project_zoon_equipments,
    )
  }
}
