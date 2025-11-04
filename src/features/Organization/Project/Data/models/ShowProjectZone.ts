import TitleInterface from '@/base/Data/Models/title_interface'

export default class SohwProjectZoonModel {
  public projectZoonId: number
  public zoonId: number
  public zoonTitle: string
  public projectZoonEquipments: TitleInterface[]
  constructor(
    projectZoonId: number,
    zoonId: number,
    zoonTitle: string,
    projectZoonEquipments: TitleInterface[],
  ) {
    this.projectZoonId = projectZoonId
    this.zoonId = zoonId
    this.zoonTitle = zoonTitle
    this.projectZoonEquipments = projectZoonEquipments
  }

  static fromMap(data: any): SohwProjectZoonModel {
    return new SohwProjectZoonModel(
      data.project_zoon_id,
      data.zoon_id,
      data.zoon_title,
      data.project_zoon_equipments,
    )
  }
}
