import type Params from '@/base/core/params/params'
import isBase64 from '@/base/Presentation/utils/isBase64'

export default class InjuryParams implements Params {
  public organizationEmployeeId: number
  public employeeName: string
  public note: string
  public injuryTypeId: number
  public incidentCategoryIds: number[]
  public images: string[]
  public ppeItem: number
  public ppeItemCondition: number
  public ppeItemText: string
  constructor(
    organizationEmployeeId: number,
    employeeName: string,
    note: string,
    injuryTypeId: number,
    incidentCategoryIds: number[],
    images: string[],
    ppeItem: number = 0,
    ppeItemCondition: number = 0,
    ppeItemText: string = '',
  ) {
    this.employeeName = employeeName
    this.organizationEmployeeId = organizationEmployeeId
    this.note = note
    this.injuryTypeId = injuryTypeId
    this.incidentCategoryIds = incidentCategoryIds
    this.images = images
    this.ppeItem = ppeItem
    this.ppeItemCondition = ppeItemCondition
    this.ppeItemText = ppeItemText
  }

  toMap(): Record<string, number | string | string[]> {
    const data: Record<string, number | string | string[]> = {}
    if (!this.organizationEmployeeId && this.employeeName) data['employee_name'] = this.employeeName
    if (this.organizationEmployeeId) data['organization_employee_id'] = this.organizationEmployeeId
    if (this.note) data['note'] = this.note
    if (this.injuryTypeId) data['injury_type_id'] = this.injuryTypeId
    if (this.incidentCategoryIds.length) data['incident_category_ids'] = this.incidentCategoryIds
    if (this.images?.length && !this.images.some((el) => !isBase64(el))) data['files'] = this.images
    if (this.ppeItem) data['ppe_item'] = this.ppeItem
    if (this.ppeItemCondition) data['ppe_item_condition'] = this.ppeItemCondition
    if (this.ppeItemText) data['ppe_item_text'] = this.ppeItemText
    return data
  }
}
