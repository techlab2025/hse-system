type MapData = Record<string, unknown>

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number') return value

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  return undefined
}

const toNullableNumber = (value: unknown): number | null => toNumber(value) ?? null

const toStringValue = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' ? value : null

const asRecord = (value: unknown): MapData | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as MapData) : null

const recordId = (value: unknown): number | undefined => {
  const directId = toNumber(value)
  if (directId !== undefined) return directId

  const record = asRecord(value)
  if (!record) return undefined

  return toNumber(
    record.id ??
      record.employee_id ??
      record.organization_employee_id ??
      record.equipment_id ??
      record.changement_topic_id ??
      record.management_change_topic_type_id,
  )
}

const recordTitle = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value

  const record = asRecord(value)
  if (!record) return undefined

  const titles = Array.isArray(record.titles) ? record.titles : []
  const localizedTitle = titles
    .map((item) => asRecord(item))
    .find((item) => item?.locale === 'en' || item?.title)

  return (
    toStringValue(record.title) ??
    toStringValue(record.name) ??
    toStringValue(record.full_name) ??
    toStringValue(record.serial_name) ??
    toStringValue(localizedTitle?.title)
  )
}

const attachmentsFrom = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (typeof item === 'string') return item

      const record = asRecord(item)
      return record
        ? toStringValue(record.file) ?? toStringValue(record.url) ?? toStringValue(record.path)
        : undefined
    })
    .filter((item): item is string => Boolean(item))
}

export default class MangementChangeModel {
  constructor(
    public id?: number,
    public risk_assisment_file?: string | null,
    public attachments: string[] = [],
    public changer_request_id: number | null = null,
    public facilty: string = '',
    public area: string = '',
    public date: string | null = null,
    public change_type?: number,
    public management_change_topic_type_id?: number,
    public status?: number,
    public approval_by: number | null = null,
    public management_change_topic_employee_id: number | null = null,
    public management_change_topic_equipment_id: number | null = null,
    public management_change_topic_text: string | null = null,
    public created_at?: string,
    public updated_at?: string,
    public topicTitle?: string,
    public topicType?: number,
    public employeeName?: string,
    public equipmentTitle?: string,
    public approvalByName?: string,
    public initiatorEmployeeName?: string,
    public initiatore_employee_id: number | null = null,
  ) {}

  static fromMap(data: MapData): MangementChangeModel {
    const topicRecord =
      data.changement_topic ??
      data.management_change_topic_type ??
      data.management_change_topic ??
      data.topic_type ??
      data.topic
    const employeeRecord =
      data.management_change_topic_employee ??
      data.changer_request_employee_id ??
      data.employee ??
      data.organization_employee
    const equipmentRecord =
      data.management_change_topic_equipment ?? data.management_change_topic_equipment_id ?? data.equipment
    const approvalByRecord =
      data.approver_by ??
      data.approval_by_employee ??
      data.approval_by_data ??
      data.approval_employee ??
      data.approval_by
    const initiatorRecord =
      data.initiator_employee_id ??
      data.initiatore_employee_id ??
      data.initiator_employee ??
      data.initiatore_employee

    const topicText = data.management_change_topic_text ?? data.topic_text ?? data.changement_topic_other
    const topicType = toNumber(asRecord(topicRecord)?.type ?? asRecord(topicRecord)?.topic_type)

    return new MangementChangeModel(
      toNumber(data.id),
      toNullableString(data.risk_assisment_file),
      attachmentsFrom(data.media ?? data.attachments ?? data.image ?? data.images),
      toNullableNumber(data.changer_request_id),
      toStringValue(data.facilty ?? data.facility) ?? '',
      toStringValue(data.area) ?? '',
      toNullableString(data.date),
      toNumber(data.changement_type ?? data.change_type),
      recordId(data.management_change_topic_type_id ?? data.changement_topic_id ?? topicRecord),
      toNumber(data.status),
      recordId(data.approval_by ?? data.approver_by ?? approvalByRecord) ?? null,
      recordId(data.management_change_topic_employee_id ?? data.changer_request_employee_id ?? employeeRecord) ?? null,
      recordId(data.management_change_topic_equipment_id ?? equipmentRecord) ?? null,
      toNullableString(topicText),
      toStringValue(data.created_at),
      toStringValue(data.updated_at),
      recordTitle(topicRecord),
      topicType,
      recordTitle(employeeRecord),
      recordTitle(equipmentRecord),
      recordTitle(approvalByRecord),
      recordTitle(initiatorRecord),
      recordId(data.initiatore_employee_id ?? data.initiator_employee_id ?? initiatorRecord) ?? null,
    )
  }
}
