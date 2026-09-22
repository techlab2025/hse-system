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

const recordTitle = (value: unknown): string | undefined => {
  const record = asRecord(value)
  if (!record) return undefined

  return (
    toStringValue(record.title) ??
    toStringValue(record.name) ??
    toStringValue(record.full_name) ??
    toStringValue(record.serial_name)
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
    public initiatore_employee_id:number | null = null,
  ) {}

  static fromMap(data: MapData): MangementChangeModel {
    const topicRecord =
      data.management_change_topic_type ??
      data.management_change_topic ??
      data.topic_type ??
      data.topic
    const employeeRecord =
      data.management_change_topic_employee ??
      data.employee ??
      data.organization_employee
    const equipmentRecord =
      data.management_change_topic_equipment ??
      data.equipment
    const approvalByRecord =
      data.approval_by_employee ??
      data.approval_by_data ??
      data.approval_employee ??
      data.approval_by

    return new MangementChangeModel(
      toNumber(data.id),
      toNullableString(data.risk_assisment_file),
      attachmentsFrom(data.attachments ?? data.image ?? data.images),
      toNullableNumber(data.changer_request_id),
      toStringValue(data.facilty) ?? '',
      toStringValue(data.area) ?? '',
      toNullableString(data.date),
      toNumber(data.change_type),
      toNumber(data.management_change_topic_type_id),
      toNumber(data.status),
      toNullableNumber(data.approval_by),
      toNullableNumber(data.management_change_topic_employee_id),
      toNullableNumber(data.management_change_topic_equipment_id),
      toNullableString(data.management_change_topic_text),
      toStringValue(data.created_at),
      toStringValue(data.updated_at),
      recordTitle(topicRecord),
      toNumber(asRecord(topicRecord)?.type),
      recordTitle(employeeRecord),
      recordTitle(equipmentRecord),
      recordTitle(approvalByRecord),
       toNullableNumber(data.initiatore_employee_id),
    )
  }
}
