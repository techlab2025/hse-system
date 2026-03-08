import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type { ActionStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/ActionStatusEnum'
import type { Observation } from '@/features/Organization/ObservationFactory/Core/Enums/ObservationTypeEnum'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class IndexCapaParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public type: Observation[]
  public projectId: number | null = null
  // public code?: LangEnum
  public projectZoonIds?: number[]
  public projectLocationIds?: number[]
  public zoonIds?: number[] = []
  public rootCauseId?: number
  public hazardTypeId?: number
  public riskLevel?: number[] = []
  public capaStatus?: ActionStatusEnum
  public equipmentIds?: number[] = []
  public saveStatus?: number[] = []
  public date?: string = ''
  public equipmentTypeIds?: number[] = []
  public equipmentSubTypeIds?: number[] = []

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    type: Observation[],
    projectId: number | null = null,
    projectZoonIds?: number[],
    projectLocationIds?: number[],
    zoonIds?: number[],
    rootCauseId?: number,
    hazardTypeId?: number,
    riskLevel?: number[],
    capaStatus?: ActionStatusEnum,
    equipmentIds?: number[],
    saveStatus?: number[],
    date?: string,
    equipmentTypeIds?: number[],
    equipmentSubTypeIds?: number[],
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.type = type
    this.projectId = projectId
    this.projectZoonIds = projectZoonIds
    this.projectLocationIds = projectLocationIds
    this.zoonIds = zoonIds
    this.rootCauseId = rootCauseId
    this.hazardTypeId = hazardTypeId
    this.riskLevel = riskLevel
    this.capaStatus = capaStatus
    this.equipmentIds = equipmentIds
    this.saveStatus = saveStatus
    this.date = date
    this.equipmentTypeIds = equipmentTypeIds
    this.equipmentSubTypeIds = equipmentSubTypeIds
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.type) data['type'] = this.type
    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_ids'] = useProjectSelectStore().SelectedProjectId(this.projectId)
    if (this.projectZoonIds) data['project_zoon_ids'] = this.projectZoonIds
    if (this.projectLocationIds) data['location_ids'] = this.projectLocationIds
    if (this.zoonIds) data['zoon_ids'] = this.zoonIds
    if (this.rootCauseId) data['root_cause_id'] = this.rootCauseId
    if (this.hazardTypeId) data['hazard_type_id'] = this.hazardTypeId
    if (this.riskLevel) data['risk_level'] = this.riskLevel
    if (this.capaStatus) data['action_status'] = this.capaStatus
    if (this.equipmentIds) data['equipment_ids'] = this.equipmentIds
    if (this.saveStatus) data['save_status'] = this.saveStatus
    if (this.date) data['date'] = formatJoinDate(this.date)
    if (this.equipmentTypeIds) data['equipment_type_ids'] = this.equipmentTypeIds
    if (this.equipmentSubTypeIds) data['equipment_sub_type_ids'] = this.equipmentSubTypeIds
    // if (this.code) data['code'] = this.code
    return data
  }
}
