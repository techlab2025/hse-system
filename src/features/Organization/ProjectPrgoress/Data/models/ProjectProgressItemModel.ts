import { ProjectProgressEnum } from '../../Core/Enum/ProjectProgressEnum'

export default class ProjectProgressItemModel {
  public id: number
  public title: string
  public progress: boolean
  constructor(id: number, title: string, progress: boolean) {
    this.id = id
    this.title = title
    this.progress = progress
  }

  static fromMap(data: any): ProjectProgressItemModel {
    return new ProjectProgressItemModel(
      data.id,
      data.title,
      data.id == ProjectProgressEnum.codingSystem ? true : data.progress,
    )
  }

  static example: ProjectProgressItemModel[] = [
    new ProjectProgressItemModel(ProjectProgressEnum.Certificate, 'Certificate', true),
    new ProjectProgressItemModel(ProjectProgressEnum.Tempalte, 'Tempalte', false),
    new ProjectProgressItemModel(ProjectProgressEnum.Employee, 'Employee', false),
    new ProjectProgressItemModel(ProjectProgressEnum.Heirarchy, 'Heirarchy', false),
    new ProjectProgressItemModel(ProjectProgressEnum.Country, 'Country', false),
    new ProjectProgressItemModel(ProjectProgressEnum.State, 'State', false),
    new ProjectProgressItemModel(ProjectProgressEnum.City, 'City', false),
    new ProjectProgressItemModel(ProjectProgressEnum.Locatio, 'Locatio', false),
    new ProjectProgressItemModel(ProjectProgressEnum.Zone, 'Zone', false),
    new ProjectProgressItemModel(ProjectProgressEnum.ObservationType, 'ObservationType', false),
    new ProjectProgressItemModel(ProjectProgressEnum.IncidantType, 'IncidantType', false),
    new ProjectProgressItemModel(ProjectProgressEnum.HazardType, 'HazardType', false),
    new ProjectProgressItemModel(ProjectProgressEnum.Hazard, 'Hazard', false),
    new ProjectProgressItemModel(ProjectProgressEnum.EquipmentType, 'EquipmentType', false),
  ]
}
