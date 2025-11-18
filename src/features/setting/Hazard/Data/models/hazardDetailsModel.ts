import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class HazardDetailsModel {
  public id: number
  public text: string
  public date: string
  public hazardType: TitleInterface
  public machineType: TitleInterface
  public image: string
  public desciption: string

  constructor(
    id: number,
    text: string,
    date: string,
    hazardType: TitleInterface,
    machineType: TitleInterface,
    image: string,
    desciption: string,
  ) {
    this.id = id
    this.text = text
    this.date = date
    this.hazardType = hazardType
    this.machineType = machineType
    this.image = image
    this.desciption = desciption
  }

  static fromMap(data: any): HazardDetailsModel {
    return new HazardDetailsModel(
      data.id,
      data.text,
      data.date,
      TitleModel.fromMap(data.hazard_type),
      TitleModel.fromMap(data.machine_type),
      data.image,
      data.desciption,
    )
  }
}
