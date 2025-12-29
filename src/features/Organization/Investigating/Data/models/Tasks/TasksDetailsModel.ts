export default class TasksDetailsModel {
  public id: number
  public investigation: investigationMeeting
  public status: number
  public title: string

  public date: string

  constructor(
    id: number,
    investigation: investigationMeeting,
    status: number,
    title: string,
    date: string,
  ) {
    this.id = id
    this.investigation = investigation
    this.status = status
    this.title = title
    this.date = date
  }

  static fromMap(data: any): TasksDetailsModel {
    return new TasksDetailsModel(data.id, data.investigation, data.status, data.title, data.due_date)
  }

  static example: TasksDetailsModel=
    new TasksDetailsModel(1, { id: 1, date: '2025-12-23', status: 0, type: 0 }, 1, '2025-12-23', '12:00'),


}

interface investigationMeeting {
  id: number
  date: string
  status: number
  type: number
}
