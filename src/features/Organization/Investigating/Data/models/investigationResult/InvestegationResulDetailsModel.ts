import type HazardModel from '@/features/Organization/ObservationFactory/Data/models/hazardModel'

export default class InvestegationResultDetailsModel {
  public id: number
  public date: string
  public observation: HazardModel
  public status: number
  public type: number

  constructor(id: number, date: string, observation: HazardModel, status: number, type: number) {
    this.id = id
    this.date = date
    this.observation = observation
    this.status = status
    this.type = type
  }

  static fromMap(data: any): InvestegationResultDetailsModel {
    return new InvestegationResultDetailsModel(
      data.id,
      data.date,
      data.observation,
      data.status,
      data.type,
    )
  }
}
