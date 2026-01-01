import SingleProjectStatisticsModel from './SingleProjectStatisticsModel'

export default class ProjectStatisticsModel {
  public id: number
  public totalProjects: number
  public Projects: SingleProjectStatisticsModel[]

  constructor(id: number, totalProjects: number, Projects: SingleProjectStatisticsModel[]) {
    this.id = id
    this.totalProjects = totalProjects
    this.Projects = Projects
  }

  static fromMap(data: any): ProjectStatisticsModel {
    return new ProjectStatisticsModel(
      data.id,
      data.total_projects,
      data.projects.map((project: any) => SingleProjectStatisticsModel.fromMap(project)),
    )
  }
  static example: ProjectStatisticsModel = new ProjectStatisticsModel(
    1,
    120,
    [
      SingleProjectStatisticsModel.example,
      SingleProjectStatisticsModel.example,
      SingleProjectStatisticsModel.example,
      SingleProjectStatisticsModel.example,
    ],
  )
}
