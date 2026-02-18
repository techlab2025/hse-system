import { SertialNumberStatusEnum } from '@/features/Organization/SerialNumber/Core/Enums/SerialNumberStatusEnum'
import ProjectProgressItemModel from './ProjectProgressItemModel'

export default class ProjectProgressModel {
  public progressItems: ProjectProgressItemModel[]
  public progress: number
  public codeSystemType: SertialNumberStatusEnum
  constructor(
    progressItems: ProjectProgressItemModel[],
    progress: number,
    codeSystemType: SertialNumberStatusEnum,
  ) {
    this.progressItems = progressItems
    this.progress = progress
    this.codeSystemType = codeSystemType
  }

  static fromMap(data: any): ProjectProgressModel {
    return new ProjectProgressModel(data.progressItems, data.progress, data.code_system_type)
  }

  static example: ProjectProgressModel = new ProjectProgressModel(
    ProjectProgressItemModel.example,
    50,
    SertialNumberStatusEnum.AUTO,
  )
}
