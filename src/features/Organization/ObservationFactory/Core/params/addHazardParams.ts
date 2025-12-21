import type Params from '@/base/core/params/params'
import type CapaParams from './CapaParam'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type { Observation } from '../Enums/ObservationTypeEnum'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import InjuryParams from './InjuriesParams'
import type DethParams from './DethParams'
import type WitnessParams from './WitnessesParams'

export default class AddHazardParams implements Params {
  public title: string | null
  public description: string | null
  public image: string[] | null
  public typeId: number | null
  public type: Observation | null
  public equipmentId: number | null
  public zoonId: number | null
  public projectId: number | null
  public isResult: number | null
  public riskLevel: number | null
  public saveStatus: number | null
  public action: string | null
  public isNearMiss: number | null
  public capaStatus: number | null
  public date: string | null
  public capa: CapaParams[] | null
  public isAction: number | null
  public isThereInjuries?: boolean | null
  public isThereDeath?: boolean | null
  public isThereWitnessStatement?: boolean | null
  public Injury?: InjuryParams[]
  public deaths?: DethParams[]
  public witnesses?: WitnessParams[]
  public severity?: number
  public Likelihood?: number

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
  })

  constructor(data: {
    title: string | null
    description: string | null
    image: string[] | null
    typeId: number | null
    type: Observation | null
    equipmentId: number | null
    zoonId: number | null
    projectId: number | null
    isResult: number | null
    riskLevel: number | null
    saveStatus: number | null
    action: string | null
    isNearMiss: number | null
    capaStatus: number | null
    date: string | null
    capa: CapaParams[] | null
    isAction: number | null
    isThereInjuries?: boolean | null
    isThereDeath?: boolean | null
    isThereWitnessStatement?: boolean | null
    Injury?: InjuryParams[]
    deaths?: DethParams[]
    witnesses?: WitnessParams[]
    severity?: number
    Likelihood?: number
  }) {
    this.title = data.title
    this.description = data.description
    this.image = data.image
    this.typeId = data.typeId
    this.type = data.type
    this.equipmentId = data.equipmentId
    this.zoonId = data.zoonId
    this.projectId = data.projectId
    this.isResult = data.isResult
    this.riskLevel = data.riskLevel
    this.saveStatus = data.saveStatus
    this.action = data.action
    this.isNearMiss = data.isNearMiss
    this.capaStatus = data.capaStatus
    this.date = data.date
    this.capa = data.capa
    this.isAction = data.isAction
    this.isThereInjuries = data.isThereInjuries
    this.isThereDeath = data.isThereDeath
    this.isThereWitnessStatement = data.isThereWitnessStatement
    this.Injury = data.Injury
    this.deaths = data.deaths
    this.witnesses = data.witnesses
    this.severity = data.severity
    this.Likelihood = data.Likelihood
  }

  toMap(): Record<
    string,
    | number
    | boolean
    | string
    | number[]
    | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | boolean
      | Record<string, string | number[] | number | any | Record<string, string>>
    > = {}

    if (this.title) data['title'] = this.title
    if (this.description) data['description'] = this.description
    if (this.image) data['files'] = this.image
    if (this.typeId) data['type_id'] = this.typeId
    if (this.type) data['type'] = this.type
    if (this.equipmentId) data['equipment_id'] = this.equipmentId
    if (this.zoonId) data['project_zoon_id'] = Number(this.zoonId)
    if (this.projectId) data['project_id'] = this.projectId
    if (this.isResult) data['is_result'] = this.isResult
    if (this.riskLevel) data['risk_level'] = this.riskLevel
    if (this.saveStatus) data['save_status'] = this.saveStatus
    if (this.action) data['action'] = this.action
    if (this.isNearMiss) data['is_near_miss'] = this.isNearMiss
    if (this.capaStatus) data['capa_status'] = this.capaStatus
    if (this.date) data['date'] = formatJoinDate(this.date)
    if (this.capa) data['capa'] = this.capa
    if (this.isAction) data['is_action'] = this.isAction
    if (this.isThereInjuries != null) data['is_there_injuries'] = this.isThereInjuries
    if (this.isThereDeath != null) data['is_there_death'] = this.isThereDeath
    if (this.isThereWitnessStatement != null) data['is_there_witness_statement'] = this.isThereWitnessStatement
    if (this.Injury?.length > 0)
      data['injuries'] = this.Injury ? this.Injury?.map((item: InjuryParams) => item.toMap()) : []
    if (this.deaths?.length > 0)
      data['deaths'] = this.deaths ? this.deaths?.map((item: DethParams) => item.toMap()) : []
    if (this.witnesses?.length > 0)
      data['witness_statements'] = this.witnesses
        ? this.witnesses?.map((item: WitnessParams) => item.toMap())
        : []
    if (this.severity) data['severity'] = this.severity
    if (this.Likelihood) data['likeli_hood'] = this.Likelihood
    return data
  }

  validate() {
    return AddHazardParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddHazardParams.validation.validateOrThrow(this)
  }
}
