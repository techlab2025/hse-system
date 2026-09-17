import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import type InvestigationTaskEmployeesModel from './investigationTaskEmployeesModel'

export default class InvestegationTasksModel {
  id: number
  title: string
  status: number
  due_date: string
  ResponsablePerson: OrganizatoinEmployeeModel
  assignedTo: OrganizatoinEmployeeModel
  investigation_meeting_id: number
  description: string
  investigationTaskEmployees: InvestigationTaskEmployeesModel[]
  answerNotes: string

  constructor(
    id: number,
    title: string,
    status: number,
    due_date: string,
    ResponsablePerson: OrganizatoinEmployeeModel,
    assignedTo: OrganizatoinEmployeeModel,
    investigation_meeting_id: number,
    description: string,
    investigationTaskEmployees: InvestigationTaskEmployeesModel[],
    answerNotes: string = '',
  ) {
    this.id = id
    this.title = title
    this.status = status
    this.due_date = due_date
    this.ResponsablePerson = ResponsablePerson
    this.assignedTo = assignedTo
    this.investigation_meeting_id = investigation_meeting_id
    this.description = description
    this.investigationTaskEmployees = investigationTaskEmployees
    this.answerNotes = answerNotes
  }

  static fromMap(data: any): InvestegationTasksModel {
    return new InvestegationTasksModel(
      data.id,
      data.title,
      data.status,
      data.due_date,
      OrganizatoinEmployeeModel.fromMap(data.responable_person),
      OrganizatoinEmployeeModel.fromMap(data.assigned_to),
      data.investigation_meeting_id,
      data.description,
      data.investigation_task_employees,
      data?.investigation_task_results?.[0]?.notes ||
        data?.investigationTaskResults?.[0]?.notes ||
        data?.task_results?.[0]?.notes ||
        data?.taskResults?.[0]?.notes ||
        data?.task_result?.notes ||
        data?.taskResult?.notes ||
        data?.notes ||
        '',
    )
  }

  static example: InvestegationTasksModel = new InvestegationTasksModel(
    1,
    'asdasdasd',
    1,
    '2025-12-23',
    'Mohab',
    'Mohab',
    12,
    'Thickening the electrical wires and reinforcing them with an insulating material',
    [],
  )
}
