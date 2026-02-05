import type Params from '@/base/core/params/params'
import type { Observation } from '../Enums/ObservationTypeEnum'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexHazardParams implements Params {
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
  public equipmentIds?: number[] = []
  public riskLevel?: number[] = []
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
    equipmentIds?: number[],
    riskLevel?: number[],
    saveStatus?: number[],
    date?: string,
    equipmentTypeIds?: number[],
    equipmentSubTypeIds?: number[],

    // code?: LangEnum,
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
    this.equipmentIds = equipmentIds
    this.riskLevel = riskLevel
    this.saveStatus = saveStatus
    this.date = date
    this.equipmentTypeIds = equipmentTypeIds
    this.equipmentSubTypeIds = equipmentSubTypeIds
    // this.code = code
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
    if (this.equipmentIds) data['equipment_ids'] = this.equipmentIds
    if (this.riskLevel) data['risk_level'] = this.riskLevel
    if (this.saveStatus) data['save_status'] = this.saveStatus
    if (this.date) data['date'] = formatJoinDate(this.date)
    if (this.equipmentTypeIds) data['equipment_type_ids'] = this.equipmentTypeIds
    if (this.equipmentSubTypeIds) data['equipment_sub_type_ids'] = this.equipmentSubTypeIds
    // if (this.code) data['code'] = this.code
    return data
  }
}
