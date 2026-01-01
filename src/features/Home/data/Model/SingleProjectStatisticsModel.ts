export default class SingleProjectStatisticsModel {
  public id: number
  public status: number
  public projectName: string
  public totalTasks: number
  public complatedTasks: number
  public inprogressTasks: number
  public holdsTasks: number

  constructor(
    id: number,
    status: number,
    projectName: string,
    totalTasks: number,
    complatedTasks: number,
    inprogressTasks: number,
    holdsTasks: number,
  ) {
    this.id = id
    this.status = status
    this.projectName = projectName
    this.totalTasks = totalTasks
    this.complatedTasks = complatedTasks
    this.inprogressTasks = inprogressTasks
    this.holdsTasks = holdsTasks
  }

  static fromMap(data: any): SingleProjectStatisticsModel {
    return new SingleProjectStatisticsModel(
      data.id,
      data.status,
      data.project_name,
      data.total_tasks,
      data.complated_tasks,
      data.inprogress_tasks,
      data.holds_tasks,
    )
  }

  static example: SingleProjectStatisticsModel = new SingleProjectStatisticsModel(
    10,
    1,
    'Eco-friendly / Sustainability-oriented Names',
    100,
    40,
    20,
    4,
  )
}
