import ProjectProgressItemModel from './ProjectProgressItemModel'

export default class ProjectProgressModel {
  public progressItems: ProjectProgressItemModel[]
  public progress: number
  constructor(progressItems: ProjectProgressItemModel[], progress: number) {
    this.progressItems = progressItems
    this.progress = progress
  }

  static fromMap(data: any): ProjectProgressModel {
    return new ProjectProgressModel(data.progressItems, data.progress)
  }

  static example: ProjectProgressModel = new ProjectProgressModel(
    ProjectProgressItemModel.example,
    50,
  )
}
