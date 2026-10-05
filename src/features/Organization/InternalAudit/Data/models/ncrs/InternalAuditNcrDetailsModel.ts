import TitleInterface from '@/base/Data/Models/title_interface'
import { NcrCategoryEnum } from '../../../Core/enums/ncrs/NcrCategoryEnum'

export type NcrDetailsAction = {
  text: string
  assignedTo: TitleInterface | null
  targetDate: string
  actualDate: string
}

export type NcrDetailsTask = {
  corrective: NcrDetailsAction
  preventive: NcrDetailsAction
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function parseTitle(value: unknown, fallbackId: unknown = 0): TitleInterface | null {
  const item = asRecord(value)
  const nested = asRecord(
    item.organization_employee ?? item.employee ?? item.assigned_to ?? item.assgined_to,
  )
  const source = Object.keys(nested).length ? nested : item
  const id = Number(
    item.organization_employee_id ??
      item.assigned_to_id ??
      item.assgined_to_id ??
      source.organization_employee_id ??
      source.id ??
      fallbackId,
  )
  const title = String(source.title ?? source.name ?? item.title ?? item.name ?? '')
  return id || title ? new TitleInterface({ id, title, name: title }) : null
}

function parseTitles(value: unknown, relationKeys: string[]): TitleInterface[] {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => {
      const item = asRecord(entry)
      const relation = relationKeys.reduce<unknown>((found, key) => found ?? item[key], null)
      return parseTitle(relation ?? item)
    })
    .filter((item): item is TitleInterface => item !== null)
}

function dateOnly(value: unknown): string {
  return String(value ?? '').slice(0, 10)
}

function parseAction(value: unknown, textKeys: string[]): NcrDetailsAction {
  const item = asRecord(value)
  const text = textKeys.reduce<unknown>((found, key) => found ?? item[key], null)
  return {
    text: String(text ?? ''),
    assignedTo: parseTitle(
      item.assigned_to ?? item.assgined_to ?? item.organization_employee ?? item.employee,
      item.assigned_to_id ?? item.assgined_to_id,
    ),
    targetDate: dateOnly(item.target_date),
    actualDate: dateOnly(item.actual_date),
  }
}

function parseTasks(value: unknown): NcrDetailsTask[] {
  if (!Array.isArray(value)) return []
  return value.map((entry) => {
    const item = asRecord(entry)
    return {
      corrective: parseAction(item.correcive_action ?? item.corrective_action, [
        'correction',
        'corrective',
      ]),
      preventive: parseAction(item.preventive_action, ['preventive', 'correction']),
    }
  })
}

function parseAttachments(value: unknown): { urls: string[]; fileNames: string[] } {
  if (!Array.isArray(value)) return { urls: [], fileNames: [] }
  const attachments = value
    .map((entry) => {
      if (typeof entry === 'string') {
        return { url: entry, fileName: entry.split('/').pop() ?? 'file' }
      }
      const item = asRecord(entry)
      const url = String(item.url ?? item.file ?? item.path ?? item.base64 ?? '')
      return {
        url,
        fileName: String(item.file_name ?? item.name ?? url.split('/').pop() ?? 'file'),
      }
    })
    .filter((attachment) => Boolean(attachment.url))
  return {
    urls: attachments.map((attachment) => attachment.url),
    fileNames: attachments.map((attachment) => attachment.fileName),
  }
}

export default class InternalAuditNcrDetailsModel {
  constructor(
    public id: number,
    public ncr: string,
    public category: NcrCategoryEnum,
    public areaUnderReviews: TitleInterface[],
    public auditStandard: TitleInterface | null,
    public requirementReference: string,
    public description: string,
    public immediateAction: string,
    public rootCauses: TitleInterface[],
    public tasks: NcrDetailsTask[],
    public attachments: string[],
    public attachmentFileNames: string[],
  ) {}

  static fromMap(data: unknown): InternalAuditNcrDetailsModel {
    const item = asRecord(data)
    const category = Number(item.ncrs_category ?? item.ncr_category ?? item.category)
    const attachments = parseAttachments(item.media)
    return new InternalAuditNcrDetailsModel(
      Number(item.id ?? item.ncrs_id ?? item.ncr_id ?? 0),
      String(item.ncr ?? item.serial_name ?? ''),
      category === NcrCategoryEnum.MAJOR_NC ? NcrCategoryEnum.MAJOR_NC : NcrCategoryEnum.MINOR_NC,
      parseTitles(item.area_under_reviews ?? item.areas_under_review, [
        'area_under_review',
        'department',
      ]),
      parseTitle(item.audit_standard, item.audit_standard_id),
      String(
        item.rquiriment_refrence ?? item.requirement_reference ?? item.requirement_refrence ?? '',
      ),
      String(item.description ?? ''),
      String(item.immediate_action ?? ''),
      parseTitles(item.root_causes, ['root_cause', 'root_causes']),
      parseTasks(item.internal_audit_tasks ?? item.tasks),
      attachments.urls,
      attachments.fileNames,
    )
  }

  static example = new InternalAuditNcrDetailsModel(
    1,
    'NCR-2026-001',
    NcrCategoryEnum.MINOR_NC,
    [new TitleInterface({ id: 616, title: 'Maintenance Workshop' })],
    new TitleInterface({ id: 1, title: 'ISO 45001:2018' }),
    'ISO 45001:2018 - 8.1',
    'Maintenance calibration records were incomplete.',
    'Missing records were collected and isolated for review.',
    [new TitleInterface({ id: 3, title: 'Process not followed' })],
    [
      {
        corrective: {
          text: 'Complete and validate all calibration records.',
          assignedTo: new TitleInterface({ id: 104, title: 'Mona Adel' }),
          targetDate: '2026-10-18',
          actualDate: '',
        },
        preventive: {
          text: 'Add a monthly calibration-record review.',
          assignedTo: new TitleInterface({ id: 102, title: 'Ahmed Hassan' }),
          targetDate: '2026-10-25',
          actualDate: '',
        },
      },
    ],
    [],
    [],
  )
}
