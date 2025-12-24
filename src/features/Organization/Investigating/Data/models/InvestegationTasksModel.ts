export default class InvestegationTasksModel {
  id: number
  title: string
  status: number
  due_date: string
  ResponsablePerson: string
  assignedTo: string
  investigation_meeting_id: number
  description: string

  constructor(
    id: number,
    title: string,
    status: number,
    due_date: string,
    ResponsablePerson: string,
    assignedTo: string,
    investigation_meeting_id: number,
    description: string,
  ) {
    this.id = id
    this.title = title
    this.status = status
    this.due_date = due_date
    this.ResponsablePerson = ResponsablePerson
    this.assignedTo = assignedTo
    this.investigation_meeting_id = investigation_meeting_id
    this.description = description
  }

  static fromMap(data: any): InvestegationTasksModel {
    return new InvestegationTasksModel(
      data.id,
      data.title,
      data.status,
      data.due_date,
      data.ResponsablePerson,
      data.assignedTo,
      data.investigation_meeting_id,
      data.description,
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
  )
}
