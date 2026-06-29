import LocationModel from '@/features/setting/Location/Data/models/LocationModel'
import SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
import ShowProjectDetailsModel from '@/features/Organization/Project/Data/models/ShowProjectDeatilsModel'
import FilesModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FilesModel'
import OvserverModel from '@/features/Organization/ObservationFactory/Data/models/OvserverModel'
import type { ActionStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/ActionStatusEnum'
import type OvservationEquipmentModel from '@/features/Organization/ObservationFactory/Data/models/OvservationEquipmentModel'
import CapaModel from '@/features/Organization/ObservationFactory/Data/models/CapaModel'

export default class IndexCapaModel {
  public id: number
  public title: string
  public description: string
  public image: string
  public isAction: number
  public taskResultItem: number
  public type: number
  public typeId: number
  public typeModel: number
  public equipment: OvservationEquipmentModel
  public location: LocationModel
  public zoon: SohwProjectZoonModel
  public project: ShowProjectDetailsModel | null
  public isResult: number
  public riskLevel: number
  public saveStatus: number
  public action: string
  public isNearMiss: string
  public capaStatus: string
  public date: string
  public serial: number
  public observer: OvserverModel | undefined
  public creator: OvserverModel | undefined
  public capa: CapaModel | undefined
  public media: FilesModel[]
  public serialName: string
  public time: string
  public actionStatus: ActionStatusEnum
  public isWorkStopped: number
  public createdAt: string
  public updatedAt: string

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
    equipment: OvservationEquipmentModel,
    location: LocationModel,
    zoon: SohwProjectZoonModel,
    project: ShowProjectDetailsModel | null,
    isResult: number,
    riskLevel: number,
    saveStatus: number,
    action: string,
    isNearMiss: string,
    capaStatus: string,
    date: string,
    serial: number,
    observer: OvserverModel | undefined,
    creator: OvserverModel | undefined,
    capa: CapaModel | undefined,
    media: FilesModel[],
    serialName: string,
    time: string,
    actionStatus: ActionStatusEnum,
    isWorkStopped: number,
    createdAt: string,
    updatedAt: string,
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
    this.media = media
    this.serialName = serialName
    this.time = time
    this.actionStatus = actionStatus
    this.isWorkStopped = isWorkStopped
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static fromMap(data: any): IndexCapaModel {
    return new IndexCapaModel(
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
      data.observer ? OvserverModel?.fromMap(data.observer) : undefined,
      data.creator ? OvserverModel?.fromMap(data.creator) : undefined,
      data.capa ? CapaModel.fromMap(data.capa) : undefined,
      data.media.map((item: any) => FilesModel.fromMap(item)),
      data.serial_name,
      data.time,
      data.action_status,
      data?.is_work_stopped,
      data?.created_at,
      data?.updated_at,
    )
  }
}
