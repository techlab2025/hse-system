import {
  PeriodicTypeEnum,
  parsePeriodicType,
  validatePeriodicNumberOfDays,
} from '../../Core/Enum/periodic_type_enum'
import type { MeetingTypeExcelRow } from '../../Core/params/addMeetingTypeExcelParams'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'

export type ExcelCell = string | number | boolean | null | undefined
export type ExcelSheet = ExcelCell[][]

export const meetingTypeExcelFields = (admin: boolean) => [
  'title',
  'periodic_type',
  'number_of_days',
  ...(admin ? ['all_industries', 'industry_ids'] : []),
]
export const normalizeMeetingTypeHeader = (value: ExcelCell): string => {
  const key = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
  return (
    (
      {
        meeting_type_title: 'title',
        meeting_type_name: 'title',
        periodictype: 'periodic_type',
        numberofdays: 'number_of_days',
        allindustries: 'all_industries',
        industryids: 'industry_ids',
      } as Record<string, string>
    )[key] ?? key
  )
}
export const meetingTypeTemplateRows = (admin: boolean) => [
  {
    title: 'Daily operations meeting',
    periodic_type: PeriodicTypeEnum.DAILY,
    number_of_days: '',
    ...(admin ? { all_industries: 1, industry_ids: '' } : {}),
  },
  {
    title: 'Weekly safety meeting',
    periodic_type: PeriodicTypeEnum.WEEKLY,
    number_of_days: 6,
    ...(admin ? { all_industries: 1, industry_ids: '' } : {}),
  },
]
export const meetingTypeExportRows = (items: MeetingTypeModel[], admin: boolean) =>
  items.map((item) => ({
    title: item.title ?? '',
    periodic_type: item.periodicType,
    number_of_days: item.periodicType === PeriodicTypeEnum.DAILY ? '' : (item.numberOfDays ?? ''),
    ...(admin
      ? {
          all_industries: item.allIndustries ? 1 : 0,
          industry_ids: item.allIndustries
            ? ''
            : item.industries.map((industry) => industry.id).join(','),
        }
      : {}),
  }))

export const buildMeetingTypeExcelRows = (
  sheet: ExcelSheet,
  admin: boolean,
): MeetingTypeExcelRow[] => {
  const headers = (sheet[0] ?? []).map(normalizeMeetingTypeHeader)
  const used = headers.filter(Boolean)
  if (new Set(used).size !== used.length) throw new Error('Excel column names must be unique.')
  const rows: MeetingTypeExcelRow[] = []
  sheet.slice(1).forEach((cells, index) => {
    if (!cells.some((cell) => String(cell ?? '').trim())) return
    const data = Object.fromEntries(headers.map((key, column) => [key, cells[column]]))
    const rowNumber = index + 2
    const fail = (message: string): never => {
      throw new Error(`${message} in Excel row ${rowNumber}`)
    }
    const title = String(data.title ?? '').trim()
    if (!title) fail('Meeting type title is required')
    const periodicType = parsePeriodicType(data.periodic_type)
    if (periodicType === null)
      fail('Periodic type must be 1 Daily, 2 Weekly, 3 Monthly, 4 Yearly or 5 Dates')
    const type = periodicType as PeriodicTypeEnum
    const days =
      type === PeriodicTypeEnum.DAILY || String(data.number_of_days ?? '').trim() === ''
        ? null
        : Number(data.number_of_days)
    const periodError = validatePeriodicNumberOfDays(type, days)
    if (periodError) fail(periodError)
    const row: MeetingTypeExcelRow = { title, periodic_type: type, number_of_days: days }
    if (admin) {
      const scope = String(data.all_industries ?? '0')
        .trim()
        .toLowerCase()
      if (!['', '0', '1', 'true', 'false', 'yes', 'no', 'نعم', 'لا'].includes(scope))
        fail('All industries must be 1 or 0')
      row.all_industries = ['1', 'true', 'yes', 'نعم'].includes(scope) ? 1 : 0
      if (!row.all_industries) {
        const ids = String(data.industry_ids ?? '').trim()
        const values = ids
          ? ids
              .split(/[,;|\s]+/)
              .filter(Boolean)
              .map(Number)
          : []
        if (values.some((id) => !Number.isInteger(id) || id <= 0))
          fail('Industry IDs must be positive integers separated by commas')
        row.industry_ids = [...new Set(values)]
      }
    }
    rows.push(row)
  })
  if (!rows.length) throw new Error('At least one data row is required.')
  return rows
}
