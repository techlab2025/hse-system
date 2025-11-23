import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'

export default class InspectionModel {
  public id: number
  public template: TemplateDetailsModel
  public date: string
  public status: number
  public periodType: number
  public periodSubType: number
  public morph: Morph
  constructor(
    id: number,
    template: TemplateDetailsModel,
    date: string,
    status: number,
    periodType: number,
    periodSubType: number,
    morph: Morph,
  ) {
    this.id = id
    this.template = template
    this.date = date
    this.status = status
    this.periodType = periodType
    this.periodSubType = periodSubType
    this.morph = morph
  }

  static fromMap(data: any): InspectionModel {
    return new InspectionModel(
      data.id,
      data.template,
      data.date,
      data.status,
      data.period_type,
      data.period_sub_type,
      data.morph,
    )
  }
}

interface Morph {
  id: number
  name: string
}
