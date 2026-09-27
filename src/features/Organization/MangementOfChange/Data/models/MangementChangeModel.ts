import TitleInterface from '@/base/Data/Models/title_interface'
import MangementChangeTopicTypeModel from '@/features/Organization/MangementChangeTopicType/Data/models/MangementChangeTopicTypeModel'
import type { MangementChangeTopicTypeEnum } from '@/features/Organization/MangementChangeTopicType/Core/Core/MangementChangeTopicTypeEnum'

type ManagementChangeReferenceData = {
  id: number
  title?: string
  name?: string
}

type ManagementChangeData = {
  id?: number
  organization_id?: unknown
  risk_assisment_file?: string | null
  media?: { url: string }[]
  changer_request_id?: number | null
  facility?: string | null
  facilty?: string | null
  area?: string | null
  date?: string | null
  changement_type?: number
  change_type?: number
  changement_topic_id?: number
  management_change_topic_type_id?: number
  status?: number
  approval_by?: number | null
  management_change_topic_employee_id?: number | null
  management_change_topic_equipment_id?: number | ManagementChangeReferenceData | null
  management_change_topic_text?: string | null
  created_at?: string
  updated_at?: string
  changement_topic?: {
    id: number
    title: string
    type: MangementChangeTopicTypeEnum
  } | null
  changer_request_employee_id?: ManagementChangeReferenceData | null
  approver_by?: ManagementChangeReferenceData | null
  initiator_employee_id?: number | null
  initiatore_employee_id?: number | null
  initiator_employee?: ManagementChangeReferenceData | null
  topic_text?: string | null
  changement_topic_other?: string | null
  created_by?: ManagementChangeReferenceData | null
}

export default class MangementChangeModel {
  public id?: number
  public organization: unknown = null
  public risk_assisment_file?: string | null
  public attachments: string[] = []
  public changer_request_id: number | null = null
  public facilty: string = ''
  public facility: string = ''
  public area: string = ''
  public date: string | null = null
  public change_type?: number
  public management_change_topic_type_id?: number
  public status?: number
  public approval_by: number | null = null
  public management_change_topic_employee_id: number | null = null
  public management_change_topic_equipment_id: number | null = null
  public management_change_topic_text: string | null = null
  public created_at?: string
  public updated_at?: string
  public topic: MangementChangeTopicTypeModel | null = null
  public employee: TitleInterface | null = null
  public equipment: TitleInterface | null = null
  public approver: TitleInterface | null = null
  public initiatorEmployee: TitleInterface | null = null
  public topicTitle?: string
  public topicType?: number
  public employeeName?: string
  public equipmentTitle?: string
  public approvalByName?: string
  public initiatorEmployeeName?: string
  public createdByName?: string
  public descriptionOfProposedChange: string = ''
  public initiatore_employee_id: number | null = null

  constructor(data: Partial<MangementChangeModel>) {
    Object.assign(this, data)
  }

  static fromMap(data: ManagementChangeData): MangementChangeModel {
    const topic = data.changement_topic
      ? MangementChangeTopicTypeModel.fromMap(data.changement_topic)
      : null
    const employee = data.changer_request_employee_id
      ? new TitleInterface({
        id: data.changer_request_employee_id.id,
        title: data.changer_request_employee_id.title ?? data.changer_request_employee_id.name,
      })
      : null
    const equipmentData =
      data.management_change_topic_equipment_id &&
      typeof data.management_change_topic_equipment_id === 'object'
        ? data.management_change_topic_equipment_id
        : null
    const equipment = equipmentData
      ? new TitleInterface({
        id: equipmentData.id,
        title: equipmentData.title ?? equipmentData.name,
      })
      : null
    const approver = data.approver_by
      ? new TitleInterface({
        id: data.approver_by.id,
        title: data.approver_by.title ?? data.approver_by.name,
      })
      : null
    const initiatorEmployee = data.initiator_employee
      ? new TitleInterface({
        id: data.initiator_employee.id,
        title: data.initiator_employee.title ?? data.initiator_employee.name,
      })
      : null
    const managementChangeText = data.topic_text ?? data.changement_topic_other

    return new MangementChangeModel({
      id: data.id,
      organization: data.organization_id,
      risk_assisment_file: data.risk_assisment_file,
      attachments: data.media?.map((item) => item.url) ?? [],
      changer_request_id: data.changer_request_id ?? null,
      facilty: data.facility ?? data.facilty ?? '',
      facility: data.facility ?? data.facilty ?? '',
      area: data.area ?? '',
      date: data.date ?? null,
      change_type: data.changement_type ?? data.change_type,
      management_change_topic_type_id:
        data.changement_topic_id ?? data.management_change_topic_type_id,
      status: data.status,
      approval_by: approver?.id ?? data.approval_by ?? null,
      management_change_topic_employee_id:
        employee?.id ?? data.management_change_topic_employee_id ?? null,
      management_change_topic_equipment_id:
        equipment?.id ??
        (typeof data.management_change_topic_equipment_id === 'number'
          ? data.management_change_topic_equipment_id
          : null),
      management_change_topic_text: managementChangeText ?? null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      topic,
      employee,
      equipment,
      approver,
      initiatorEmployee,
      topicTitle: topic?.title,
      topicType: topic?.type,
      employeeName: employee?.title,
      equipmentTitle: equipment?.title,
      approvalByName: approver?.title,
      initiatorEmployeeName: initiatorEmployee?.title,
      createdByName:
        data.created_by?.title ??
        data.created_by?.name ??
        initiatorEmployee?.title,
      descriptionOfProposedChange: managementChangeText ?? topic?.title ?? '',
      initiatore_employee_id:
        data.initiator_employee_id ?? data.initiatore_employee_id ?? initiatorEmployee?.id ?? null,
    })
  }
}
