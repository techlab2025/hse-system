import TitleInterface from '@/base/Data/Models/title_interface'
import IndexCapaModel from './IndexCapaModel'
import InvestigatingModel from '@/features/Organization/Investigating/Data/models/investigatingModel'

export default class ShowCapaDetailsModel extends TitleInterface {
  public id: number
  public corrective: string
  public preventive: string
  public serialName: string
  public observationCapaId: number
  public observationId: number
  public date: string
  public time: string
  public observation: IndexCapaModel
  public investigation: InvestigatingModel

  constructor(data: {
    id: number
    corrective: string
    preventive: string
    serialName: string
    observationCapaId: number
    observationId: number
    date: string
    time: string
    observation: IndexCapaModel
    investigation: InvestigatingModel
  }) {
    super({ id: data.id, title: '' })
    this.id = data.id
    this.corrective = data.corrective
    this.preventive = data.preventive
    this.serialName = data.serialName
    this.observationCapaId = data.observationCapaId
    this.observationId = data.observationId
    this.date = data.date
    this.time = data.time
    this.observation = data.observation
    this.investigation = data.investigation
  }

  static fromMap(data: any): ShowCapaDetailsModel {
    return new ShowCapaDetailsModel({
      id: data.id,
      corrective: data.corrective,
      preventive: data.preventive,
      serialName: data.serial_name,
      observationCapaId: data.observation_capa_id,
      observationId: data.observation_id,
      date: data.date,
      time: data.time,
      observation: IndexCapaModel.fromMap(data.observation),
      investigation: InvestigatingModel.fromMap(data.investigation),
    })
  }
}
