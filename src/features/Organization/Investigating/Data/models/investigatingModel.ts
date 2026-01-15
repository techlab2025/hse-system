import LocationModel from '@/features/setting/Location/Data/models/LocationModel'
import SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
import ShowProjectDetailsModel from '@/features/Organization/Project/Data/models/ShowProjectDeatilsModel'
import CapaModel from './CapaModel'
import OvservationEquipmentModel from '@/features/Organization/ObservationFactory/Data/models/OvservationEquipmentModel'
import OvserverModel from '@/features/Organization/ObservationFactory/Data/models/OvserverModel'
import InvestegationObservationModel from './InvestigationHelperModels/InvestegationObservationModel'
import acc from '@/assets/images/acc.png'
import { InvestegationStatusEnum } from '../../Core/Enums/InvestegationStatusEnum'
import HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel'
export default class InvestigatingModel {
  public Investegationid: number
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
  public observer: OvserverModel
  public creator: OvserverModel
  public capa: CapaModel
  public status: number
  public observation: HazardDetailsModel
  public LatestInvestigatingMeetingId: number
  public hasResults: boolean

  constructor(
    Investegationid: number,
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
    observer: OvserverModel,
    creator: OvserverModel,
    capa: CapaModel,
    status: number,
    observation: HazardDetailsModel,
    LatestInvestigatingMeetingId: number,
    hasResults: boolean,
  ) {
    this.Investegationid = Investegationid
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
    this.status = status
    this.observation = observation
    this.LatestInvestigatingMeetingId = LatestInvestigatingMeetingId
    this.hasResults = hasResults
  }

  static fromMap(data: any): InvestigatingModel {
    return new InvestigatingModel(
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
      // OvserverModel.fromMap(data.observer),
      // OvserverModel.fromMap(data.creator),
      data.observer,
      data.creator,
      data.capa,
      data.status,
      HazardDetailsModel.fromMap(data.observation),
      data.latest_investigation_meeting_id,
      data.has_results,
    )
  }

  static example: InvestigatingModel = [
    new InvestigatingModel(
      10,
      'First Investegation',
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
      acc,
      1,
      1,
      2,
      20,
      1,
      OvservationEquipmentModel.example,
      LocationModel.example,
      SohwProjectZoonModel.example,
      ShowProjectDetailsModel.example,
      1,
      1,
      1,
      'Action',
      '1',
      '1',
      '1-9-2001',
      123,
      OvserverModel.example,
      OvserverModel.example,
      CapaModel.example,
      InvestegationStatusEnum.NEW,
      InvestegationObservationModel.example,
      0,
    ),
    new InvestigatingModel(
      10,
      'First Investegation',
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
      acc,
      1,
      1,
      2,
      20,
      1,
      OvservationEquipmentModel.example,
      LocationModel.example,
      SohwProjectZoonModel.example,
      ShowProjectDetailsModel.example,
      1,
      1,
      0,
      'Action',
      '1',
      '1',
      '1-9-2001',
      123,
      OvserverModel.example,
      OvserverModel.example,
      CapaModel.example,
      InvestegationStatusEnum.COMPLETED,
      InvestegationObservationModel.example,
      0,
    ),
    new InvestigatingModel(
      10,
      'First Investegation',
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
      acc,
      1,
      1,
      3,
      20,
      1,
      OvservationEquipmentModel.example,
      LocationModel.example,
      SohwProjectZoonModel.example,
      ShowProjectDetailsModel.example,
      1,
      1,
      1,
      'Action',
      '1',
      '1',
      '1-9-2001',
      123,
      OvserverModel.example,
      OvserverModel.example,
      CapaModel.example,
      InvestegationStatusEnum.HOLD,
      InvestegationObservationModel.example,
      0,
    ),
    new InvestigatingModel(
      10,
      'First Investegation',
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
      acc,
      1,
      1,
      3,
      20,
      1,
      OvservationEquipmentModel.example,
      LocationModel.example,
      SohwProjectZoonModel.example,
      ShowProjectDetailsModel.example,
      1,
      1,
      1,
      'Action',
      '1',
      '1',
      '1-9-2001',
      123,
      OvserverModel.example,
      OvserverModel.example,
      CapaModel.example,
      InvestegationStatusEnum.IN_PROGRESS,
      InvestegationObservationModel.example,
      0,
    ),
  ]
}
