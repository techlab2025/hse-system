import TitleModel from '@/base/core/Models/title_model'

export default class ProjectLocationEquipmentModel extends TitleModel {
  public Equipments: TitleModel[]

  constructor(id: number, title: string, Equipments: TitleModel[]) {
    super(title, id)
    this.Equipments = Equipments
  }

  static fromMap(data: any): ProjectLocationEquipmentModel {
    return new ProjectLocationEquipmentModel(data.id, data.title, data.Equipments)
  }
}
