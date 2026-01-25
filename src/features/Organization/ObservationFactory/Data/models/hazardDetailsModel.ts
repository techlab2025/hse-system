import ShowProjectDetailsModel from '@/features/Organization/Project/Data/models/ShowProjectDeatilsModel'
import SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
// import { LocationModel } from '@/features/setting/Location/Data/models/LocationModel'
import OvservationEquipmentModel from './OvservationEquipmentModel'
import OvserverModel from './OvserverModel'
import CapaModel from './CapaModel'
import LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import FilesModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FilesModel'
import InjuryDetailsModel from './InjuryModel'
import { LikelihoodEnum } from '../../Core/Enums/LikelihoodEnum'
import { SeverityEnum } from '../../Core/Enums/SeverityEnum'
import InspectionObservatioModel from './InspectionObservationModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import InvestegationResultDetailsModel from '@/features/Organization/Investigating/Data/models/investigationResult/InvestegationResulDetailsModel'
import acc from '@/assets/images/acc.png'
import { Observation } from '../../Core/Enums/ObservationTypeEnum'
import type { ActionStatusEnum } from '../../Core/Enums/ActionStatusEnum'

export default class HazardDetailsModel {
  public id: number
  public title: string
  public description: string
  public image: string
  public isAction: number
  public taskResultItem: number
  public type: number
  public typeId: number
  public typeModel: TitleInterface
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
  public taskResultItemAnswer: InspectionObservatioModel
  public rootCauses: TitleInterface[]
  public investigation: InvestegationResultDetailsModel
  public isWorkStopped: boolean
  public actionStatus: ActionStatusEnum

  constructor(
    id: number,
    title: string,
    description: string,
    image: string,
    isAction: number,
    taskResultItem: number,
    type: number,
    typeId: number,
    typeModel: TitleInterface,
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
    taskResultItemAnswer: InspectionObservatioModel,
    rootCauses: TitleInterface[],
    investigation: InvestegationResultDetailsModel,
    isWorkStopped: boolean,
    actionStatus: ActionStatusEnum,
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
    this.taskResultItemAnswer = taskResultItemAnswer
    this.rootCauses = rootCauses
    this.investigation = investigation
    this.isWorkStopped = isWorkStopped
    this.actionStatus = actionStatus
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
      data?.injuries?.map((item: any) => InjuryDetailsModel.fromMap(item)),
      data?.witness_statements?.map((item: any) => InjuryDetailsModel.fromMap(item)),
      data?.deaths?.map((item: any) => InjuryDetailsModel.fromMap(item)),
      data?.like_lihood,
      data?.severity,
      data?.task_result_item_answer,
      data?.root_causes,
      data?.investigation ? InvestegationResultDetailsModel.fromMap(data?.investigation) : null,
      data?.is_work_stopped,
      data?.action_status,
    )
  }

  static example: HazardDetailsModel = new HazardDetailsModel(
    1,
    'New Observation FactoryModel Title',
    'New Observation FactoryModel Title',
    acc,
    1,
    1,
    Observation.AccidentsType,
    20,
    { id: 1, title: 'Mohab Mohamed' },
    [OvservationEquipmentModel.example],
    LocationDetailsModel.example,
    SohwProjectZoonModel.example,
    ShowProjectDetailsModel.example,
    1,
    1,
    1,
    'I Take An Action',
    'no',
    'CapaStatus',
    '1-920001',
    123456,
    OvserverModel.example,
    OvserverModel.example,
    CapaModel.example,
    123456,
    [acc, acc],
    [InjuryDetailsModel.example],
    [InjuryDetailsModel.example],
    [InjuryDetailsModel.example],
    LikelihoodEnum.AlmostCertain,
    SeverityEnum.Catastrophic,
    InspectionObservatioModel.example,
    [{ id: 1, title: 'title' }],
    InvestegationResultDetailsModel.example,
  )
}
