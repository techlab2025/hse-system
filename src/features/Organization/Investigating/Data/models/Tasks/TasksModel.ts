export default class TasksModel {
  public id: number
  public investigation: investigationMeeting
  public status: number
  public title: string
  public date: string
  public createdAt: string
  public description: string
  public assignedTo: string
  public responablePerson: string

  constructor(
    id: number,
    investigation: investigationMeeting,
    status: number,
    title: string,
    date: string,
    createdAt: string,
    description: string,
    assignedTo: string,
    responablePerson: string,
  ) {
    this.id = id
    this.investigation = investigation
    this.status = status
    this.title = title
    this.date = date
    this.createdAt = createdAt
    this.description = description
    this.assignedTo = assignedTo
    this.responablePerson = responablePerson
  }

  static fromMap(data: any): TasksModel {
    return new TasksModel(
      data.id,
      data.investigation_meeting_id,
      data.status,
      data.title,
      data.due_date,
      data.created_at,
      data.description,
      data.assigned_to,
      data.responable_person,
    )
  }

  static example: TasksModel[] = [
    new TasksModel(
      1,
      { id: 1, date: '2025-12-23', status: 2, type: 0 },
      2,
      '2025-12-23',
      '12:00',
      '10-12-2000',
      'description description description description description description',
      'Mohab Mohamed',
      'Mohab Mohamed',
    ),
    new TasksModel(
      1,
      { id: 1, date: '2025-12-23', status: 1, type: 0 },
      1 ,
      '2025-12-23',
      '12:00',
      '10-12-2000',
      'description description description description description description',
      'Mohab Mohamed',
      'Mohab Mohamed',
    ),
    new TasksModel(
      1,
      { id: 1, date: '2025-12-23', status: 1, type: 0 },
      1,
      '2025-12-23',
      '12:00',
      '10-12-2000',
      'description description description description description description',
      'Mohab Mohamed',
      'Mohab Mohamed',
    ),
    new TasksModel(
      1,
      { id: 1, date: '2025-12-23', status: 2, type: 0 },
      2,
      '2025-12-23',
      '12:00',
      '10-12-2000',
      'description description description description description description',
      'Mohab Mohamed',
      'Mohab Mohamed',
    ),
  ]
}

interface investigationMeeting {
  id: number
  date: string
  status: number
  type: number
}
