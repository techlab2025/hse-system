import TitleInterface from '@/base/Data/Models/title_interface'

export type InternalAuditAttendanceEmployee = {
  id: number
  name: string
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'string') return ['1', 'true', 'yes'].includes(value.toLowerCase())
  return value === true || value === 1
}

function parseTitle(value: unknown): TitleInterface | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const item = value as Record<string, unknown>
  return new TitleInterface({ id: Number(item.id ?? 0), title: String(item.title ?? '') })
}

export default class InternalAuditAttendanceModel {
  constructor(
    public id: number,
    public employee: InternalAuditAttendanceEmployee,
    public pisition: TitleInterface | null,
    public department: TitleInterface | null,
    public openMeeting: boolean,
    public closeMeeting: boolean,
  ) {}

  get position(): TitleInterface | null {
    return this.pisition
  }

  get open_meeting(): boolean {
    return this.openMeeting
  }

  get close_meeting(): boolean {
    return this.closeMeeting
  }

  static fromMap(data: unknown): InternalAuditAttendanceModel {
    const item = (data ?? {}) as Record<string, unknown>
    const employee = (item.employee ?? {}) as Record<string, unknown>

    return new InternalAuditAttendanceModel(
      Number(item.id ?? item.internal_audit_attendance_id ?? item.internal_audit_attendace_id ?? 0),
      { id: Number(employee.id ?? 0), name: String(employee.name ?? '') },
      parseTitle(item.pisition ?? item.position),
      parseTitle(item.department),
      parseBoolean(item.open_meeting ?? item.open_meting),
      parseBoolean(item.close_meeting ?? item.closing_meeting),
    )
  }

  static example: InternalAuditAttendanceModel[] = [
    new InternalAuditAttendanceModel(
      1,
      { id: 101, name: 'Sara Ibrahim' },
      new TitleInterface({ id: 11, title: 'HSE Manager' }),
      new TitleInterface({ id: 21, title: 'Health and Safety' }),
      true,
      true,
    ),
    new InternalAuditAttendanceModel(
      2,
      { id: 102, name: 'Ahmed Hassan' },
      new TitleInterface({ id: 12, title: 'Maintenance Engineer' }),
      new TitleInterface({ id: 22, title: 'Maintenance' }),
      true,
      false,
    ),
    new InternalAuditAttendanceModel(
      3,
      { id: 103, name: 'Mona Ali' },
      new TitleInterface({ id: 13, title: 'Quality Specialist' }),
      new TitleInterface({ id: 23, title: 'Quality' }),
      false,
      false,
    ),
  ]
}
