import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model'

export default class IncedantDetailsModel {
  public id: number
  public text: string
  public date: string
  public machineType: TitleInterface
  public image: string
  public desciption: string

  constructor(
    id: number,
    text: string,
    date: string,
    machineType: TitleInterface,
    image: string,
    desciption: string,
  ) {
    this.id = id
    this.text = text
    this.date = date
    this.machineType = machineType
    this.image = image
    this.desciption = desciption
  }

  static fromMap(data: any): IncedantDetailsModel {
    return new IncedantDetailsModel(
      data.id,
      data.text,
      data.date,
      TitleModel.fromMap(data.machine_type),
      data.image,
      data.desciption,
    )
  }
}
