import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model'

export default class IncedantModel {
  public id: number
  public text: string
  public date: string
  public machineType: TitleInterface
  public image: string
  public description: string
  constructor(
    id: number,
    text: string,
    date: string,
    machineType: TitleInterface,
    image: string,
    description: string,
  ) {
    this.id = id
    this.text = text
    this.date = date
    this.machineType = machineType
    this.image = image
    this.description = description
  }

  static fromMap(data: any): IncedantModel {
    return new IncedantModel(
      data.id,
      data.text,

      data.date,
      TitleModel.fromMap(data.machine_type),
      data.image,
      data.description,
    )
  }
}
