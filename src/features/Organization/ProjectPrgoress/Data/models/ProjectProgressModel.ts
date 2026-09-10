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
    const rawItems = Array.isArray(data) ? data : (data.progressItems ?? data.progress_items ?? [])
    const progressItems: ProjectProgressItemModel[] = rawItems.map((item: any) =>
      ProjectProgressItemModel.fromMap(item),
    )
    const requiredItems = progressItems.filter((item) => item.required)
    const calculatedProgress = requiredItems.length
      ? Math.round(
          (requiredItems.filter((item) => item.progress).length / requiredItems.length) * 100,
        )
      : 0

    return new ProjectProgressModel(
      progressItems,
      Number(Array.isArray(data) ? calculatedProgress : (data.progress ?? calculatedProgress)),
      Array.isArray(data)
        ? SertialNumberStatusEnum.AUTO
        : (data.code_system_type ?? SertialNumberStatusEnum.AUTO),
    )
  }

  static example: ProjectProgressModel = new ProjectProgressModel(
    ProjectProgressItemModel.example,
    50,
    SertialNumberStatusEnum.AUTO,
  )
}
