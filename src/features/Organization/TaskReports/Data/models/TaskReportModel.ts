import { CapaTaskDetailsModel } from '@/features/Organization/Capa/Data/models/CapaTasksModel'
import InvestigatingDetailsModel from '@/features/Organization/Investigating/Data/models/investigatingDetailsModel'
import HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel'

type RawTask = Record<string, unknown>

const asRecord = (value: unknown): RawTask =>
  value !== null && typeof value === 'object' ? (value as RawTask) : {}

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

const stringValue = (...values: unknown[]) =>
  values.find((value): value is string => typeof value === 'string') ?? ''

const numberValue = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const nestedName = (...values: unknown[]) =>
  stringValue(...values.map((value) => asRecord(value).name))

const firstResultNotes = (data: RawTask) => {
  const resultCollections = [
    data.investigation_task_results,
    data.investigationTaskResults,
    data.task_results,
    data.taskResults,
  ]

  for (const collection of resultCollections) {
    const notes = asRecord(asArray(collection)[0]).notes
    if (typeof notes === 'string') return notes
  }

  return stringValue(asRecord(data.task_result).notes, asRecord(data.taskResult).notes, data.notes)
}

export interface TaskReportProjectReference {
  id: number
  title: string
  serial_name: string
}

export default class TaskReportModel extends CapaTaskDetailsModel {
  public description: string
  public createdAt: string
  public investigationMeetingId: number | null
  public investigation_id: number
  public serial_name: string
  public observation: HazardDetailsModel
  public investigation: InvestigatingDetailsModel | null
  public project: TaskReportProjectReference

  constructor(data: {
    id: number
    title: string
    description: string
    status: number
    dueDate: string
    createdAt: string
    assignedToName: string
    responsiblePersonName: string
    investigationMeetingId: number | null
    answerNotes?: string
    investigation_id?: number
    serial_name?: string
    observation?: HazardDetailsModel
    project?: TaskReportProjectReference
     investigation: InvestigatingDetailsModel | null
  }) {
    super(data)
    this.description = data.description
    this.createdAt = data.createdAt
    this.investigationMeetingId = data.investigationMeetingId
    this.investigation_id = data.investigation_id ?? 0
    this.serial_name = data.serial_name ?? ''
    this.observation = data.observation ?? HazardDetailsModel.fromMap({})
    this.project = data.project ?? { id: 0, title: '', serial_name: '' }
    this.investigation = data.investigation ?? null
  }

  static fromMap(value: unknown): TaskReportModel {
    const data = asRecord(value)
    const taskEmployee =
      asArray(data.investigation_task_employees)[0] ?? asArray(data.investigationTaskEmployees)[0]
    const employee = asRecord(taskEmployee)
    const project = asRecord(data.project)

    return new TaskReportModel({
      id: numberValue(data.id, 0),
      title: stringValue(data.title),
      description: stringValue(data.description),
      status: numberValue(data.status, 1),
      dueDate: stringValue(data.due_date, data.dueDate, data.date),
      createdAt: stringValue(data.created_at, data.createdAt),
      assignedToName:
        nestedName(data.assigned_to, data.assignedTo, employee.employee, data.employee) || '',
      responsiblePersonName:
        nestedName(
          data.responable_person,
          data.responsible_person,
          data.responsiblePerson,
          employee.follow_up_employee,
        ) || '',
      investigationMeetingId:
        data.investigation_meeting_id == null && data.investigationMeetingId == null
          ? null
          : numberValue(data.investigation_meeting_id ?? data.investigationMeetingId, 0),
      answerNotes: firstResultNotes(data),
      investigation_id: numberValue(data.investigation_id, 0),
      serial_name: stringValue(data.serial_name),
      observation: HazardDetailsModel.fromMap(data.observation ?? {}),
      project: {
        id: numberValue(project.id ?? project.project_id, 0),
        title: stringValue(project.title),
        serial_name: stringValue(project.serial_name),
      },
      investigation: InvestigatingDetailsModel.fromMap(data.investigation ?? {}),
  })}

  // static examples: TaskReportModel[] = [
  //   new TaskReportModel({
  //     id: 1,
  //     title: 'Review the corrective action plan',
  //     description: 'Verify that the assigned action resolves the identified root cause.',
  //     status: 2,
  //     dueDate: '2026-08-15',
  //     createdAt: '2026-07-20',
  //     assignedToName: 'HSE team member',
  //     responsiblePersonName: 'HSE manager',
  //     investigationMeetingId: 1,
  //     investigation_id: 1,
  //   }),
  // ]
}
