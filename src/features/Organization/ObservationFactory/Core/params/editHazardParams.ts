import type Params from '@/base/core/params/params.ts'
import type { Observation } from '../Enums/ObservationTypeEnum'
import type CapaParams from './CapaParam'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class EditHazardParams implements Params {
  public id: number
  public title: string | null
  public description: string | null
  public image: string | null
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

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
  })

  constructor(
    id: number,
    title: string | null,
    description: string | null,
    image: string | null,
    typeId: number | null,
    type: Observation | null,
    equipmentId: number | null,
    zoonId: number | null,
    projectId: number | null,
    isResult: number | null,
    riskLevel: number | null,
    saveStatus: number | null,
    action: string | null,
    isNearMiss: number | null,
    capaStatus: number | null,
    date: string | null,
    capa: CapaParams[] | null,
    isAction: number | null,
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.image = image
    this.typeId = typeId
    this.type = type
    this.equipmentId = equipmentId
    this.zoonId = zoonId
    this.projectId = projectId
    this.isResult = isResult
    this.riskLevel = riskLevel
    this.saveStatus = saveStatus
    this.action = action
    this.isNearMiss = isNearMiss
    this.capaStatus = capaStatus
    this.date = date
    this.capa = capa
    this.isAction = isAction
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['observation_id'] = this.id
    if (this.title) data['title'] = this.title
    if (this.description) data['description'] = this.description
    if (this.image) data['image'] = this.image
    if (this.typeId) data['type_id'] = this.typeId
    if (this.type) data['type'] = this.type
    if (this.equipmentId) data['equipment_id'] = this.equipmentId
    if (this.zoonId) data['zoon_id'] = this.zoonId
    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.projectId)
    if (this.isResult) data['is_result'] = this.isResult
    if (this.riskLevel) data['risk_level'] = this.riskLevel
    if (this.saveStatus) data['save_status'] = this.saveStatus
    if (this.action) data['action'] = this.action
    if (this.isNearMiss) data['is_near_miss'] = this.isNearMiss
    if (this.capaStatus) data['capa_status'] = this.capaStatus
    if (this.date) data['date'] = this.date
    if (this.capa) data['capa'] = this.capa
    if (this.isAction) data['is_action'] = this.isAction
    return data
  }

  validate() {
    return EditHazardParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditHazardParams.validation.validateOrThrow(this)
  }
}
