import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import MorphModel from './MorphModel'
import LastInspectionModel from './LastInspectionModel'

export default class InspectionModel {
  public id: number
  public template: TemplateDetailsModel
  public date: string
  public status: number
  public periodType: number
  public periodSubType: number
  public morph: MorphModel
  public serialNumber: string
  public serial: string
  public numberOfResults: number
  public morphType: number
  public morphId: number
  public lastInspectionResult: LastInspectionModel
  public createdBy: CreatedBy
  public hasResults: boolean
  constructor(
    id: number,
    template: TemplateDetailsModel,
    date: string,
    status: number,
    periodType: number,
    periodSubType: number,
    morph: MorphModel,
    serialNumber: string,
    serial: string,
    numberOfResults: number,
    morphType: number,
    morphId: number,
    lastInspectionResult: LastInspectionModel,
    createdBy: CreatedBy,
    hasResults: boolean,
  ) {
    this.id = id
    this.template = template
    this.date = date
    this.status = status
    this.periodType = periodType
    this.periodSubType = periodSubType
    this.morph = morph
    this.serialNumber = serialNumber
    this.serial = serial
    this.numberOfResults = numberOfResults
    this.morphType = morphType
    this.morphId = morphId
    this.lastInspectionResult = lastInspectionResult
    this.createdBy = createdBy
    this.hasResults = hasResults
  }

  static fromMap(data: any): InspectionModel {
    return new InspectionModel(
      data.id,
      data.template,
      data.date,
      data.status,
      data.period_type,
      data.period_sub_type,
      data.morph ? MorphModel.fromMap(data.morph) : null,
      data.serial_number,
      data.serial,
      data.number_of_results,
      data.morph_type,
      data.morph_id,
      data.last_inspection_result ? LastInspectionModel.fromMap(data.last_inspection_result) : null,
      data.created_by,
      data.has_results,
    )
  }
}

interface CreatedBy {
  id: number
  organization_employee_id: number
  name: string
  hierarchy: any[]
}
