export class CapaTaskDetailsModel {
  public id: number
  public title: string
  public status: number
  public dueDate: string
  public assignedToName: string
  public responsiblePersonName: string
  public answerNotes: string

  constructor(data: {
    id: number
    title: string
    status: number
    dueDate: string
    assignedToName: string
    responsiblePersonName: string
    answerNotes?: string
  }) {
    this.id = data.id
    this.title = data.title
    this.status = data.status
    this.dueDate = data.dueDate
    this.assignedToName = data.assignedToName
    this.responsiblePersonName = data.responsiblePersonName
    this.answerNotes = data.answerNotes ?? ''
  }

  static fromMap(data: any): CapaTaskDetailsModel {
    const taskEmployees = data?.investigation_task_employees?.[0]

    return new CapaTaskDetailsModel({
      id: data?.id,
      title: data?.title,
      status: data?.status,
      dueDate: data?.due_date,
      assignedToName:
        data?.assigned_to?.name ||
        taskEmployees?.employee?.name ||
        data?.employee?.name ||
        data?.assignedTo?.name ||
        '',
      responsiblePersonName:
        data?.responable_person?.name ||
        data?.responsible_person?.name ||
        taskEmployees?.follow_up_employee?.name ||
        data?.ResponablePerson?.name ||
        '',
      answerNotes:
        data?.investigation_task_results?.[0]?.notes ||
        data?.investigationTaskResults?.[0]?.notes ||
        data?.task_results?.[0]?.notes ||
        data?.taskResults?.[0]?.notes ||
        data?.task_result?.notes ||
        data?.taskResult?.notes ||
        data?.notes ||
        '',
    })
  }
}
