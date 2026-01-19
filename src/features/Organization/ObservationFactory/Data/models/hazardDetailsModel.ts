import type ShowProjectDetailsModel from '@/features/Organization/Project/Data/models/ShowProjectDeatilsModel'
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
// import { LocationModel } from '@/features/setting/Location/Data/models/LocationModel'
import type OvservationEquipmentModel from './OvservationEquipmentModel'
import type OvserverModel from './OvserverModel'
import type CapaModel from './CapaModel'
import type LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import FilesModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FilesModel'
import InjuryDetailsModel from './InjuryModel'
import type { LikelihoodEnum } from '../../Core/Enums/LikelihoodEnum'
import type { SeverityEnum } from '../../Core/Enums/SeverityEnum'

export default class HazardDetailsModel {
  public id: number
  public title: string
  public description: string
  public image: string
  public isAction: number
  public taskResultItem: number
  public type: number
  public typeId: number
  public typeModel: number
  public equipment: OvservationEquipmentModel[]
  public location: LocationDetailsModel
  public zoon: SohwProjectZoonModel
  public project: ShowProjectDetailsModel
  public isResult: number
  public riskLevel: number
  public saveStatus: number
  public action: string
  public isNearMiss: string
  public capaStatus: string
  public date: string
  public serial: number
  public observer: OvserverModel
  public creator: OvserverModel
  public capa: CapaModel
  public serialNumber: number
  public media: FilesModel[]
  public injuries: InjuryDetailsModel[]
  public witnessStatements: InjuryDetailsModel[]
  public deaths: InjuryDetailsModel[]
  public like_lihood: LikelihoodEnum
  public severity: SeverityEnum

  constructor(
    id: number,
    title: string,
    description: string,
    image: string,
    isAction: number,
    taskResultItem: number,
    type: number,
    typeId: number,
    typeModel: number,
    equipment: OvservationEquipmentModel[],
    location: LocationDetailsModel,
    zoon: SohwProjectZoonModel,
    project: ShowProjectDetailsModel,
    isResult: number,
    riskLevel: number,
    saveStatus: number,
    action: string,
    isNearMiss: string,
    capaStatus: string,
    date: string,
    serial: number,
    observer: OvserverModel,
    creator: OvserverModel,
    capa: CapaModel,
    serialNumber: number,
    media: FilesModel[],
    injuries: InjuryDetailsModel[],
    witnessStatements: InjuryDetailsModel[],
    deaths: InjuryDetailsModel[],
    like_lihood: LikelihoodEnum,
    severity: SeverityEnum,
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.image = image
    this.isAction = isAction
    this.taskResultItem = taskResultItem
    this.type = type
    this.typeId = typeId
    this.typeModel = typeModel
    this.equipment = equipment
    this.location = location
    this.zoon = zoon
    this.project = project
    this.isResult = isResult
    this.riskLevel = riskLevel
    this.saveStatus = saveStatus
    this.action = action
    this.isNearMiss = isNearMiss
    this.capaStatus = capaStatus
    this.date = date
    this.serial = serial
    this.observer = observer
    this.creator = creator
    this.capa = capa
    this.serialNumber = serialNumber
    this.media = media
    this.injuries = injuries
    this.witnessStatements = witnessStatements
    this.deaths = deaths
    this.like_lihood = like_lihood
    this.severity = severity
  }

  static fromMap(data: any): HazardDetailsModel {
    return new HazardDetailsModel(
      data.id,
      data.title,
      data.description,
      data.image,
      data.is_action,
      data.task_result_item,
      data.type,
      data.type_id,
      data.type_model,
      data.equipment,
      data.location,
      data.zoon,
      data.project,
      data.is_result,
      data.risk_level,
      data.save_status,
      data.action,
      data.is_near_miss,
      data.capa_status,
      data.date,
      data.serial,
      data.observer,
      data.creator,
      data.capa,
      data.serial_number,
      data.media.map((item: any) => FilesModel.fromMap(item)),
      data.injuries.map((item: any) => InjuryDetailsModel.fromMap(item)),
      data.witness_statements.map((item: any) => InjuryDetailsModel.fromMap(item)),
      data.deaths.map((item: any) => InjuryDetailsModel.fromMap(item)),
      data.like_lihood,
      data.severity,
    )
  }
}
