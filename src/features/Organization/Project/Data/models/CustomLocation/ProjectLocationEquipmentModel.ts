import TitleModel from '@/base/core/Models/title_model'
import type TitleInterface from '@/base/Data/Models/title_interface'

export default class ProjectLocationEquipmentModel extends TitleModel {
  public equipmentDescription: string
  public projectZoonEquipmentId: number
  public equipmenType: TitleInterface

  constructor(
    id: number,
    title: string,
    equipmentDescription: string,
    projectZoonEquipmentId: number,
    equipmenType: TitleInterface,
  ) {
    super(title, id)
    this.equipmentDescription = equipmentDescription
    this.projectZoonEquipmentId = projectZoonEquipmentId
    this.equipmenType = equipmenType
  }

  static fromMap(data: any): ProjectLocationEquipmentModel {
    return new ProjectLocationEquipmentModel(
      data.equipment_id || data.id,
      data.equipment_title || data.title,
      data.equipment_description,
      data.project_zoon_equipment_id,
      data.equipment_type,
    )
  }
}
