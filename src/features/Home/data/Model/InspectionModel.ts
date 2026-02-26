export default class InspectionModel {
  public newInspection: number
  public inProgress: number
  public completed: number
  public canceled: number
  public delayed: number

  constructor(newInspection: number, inProgress: number, completed: number, canceled: number, delayed: number) {
    this.newInspection = newInspection
    this.inProgress = inProgress
    this.completed = completed
    this.canceled = canceled
    this.delayed = delayed
  }

  static fromMap(data: any): InspectionModel {
    return new InspectionModel(
      data.new,
      data.in_progress,
      data.completed,
      data.canceled,
      data.delayed,
    )
  }
}
