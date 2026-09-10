import { ProjectProgressEnum } from '../../Core/Enum/ProjectProgressEnum'

export default class ProjectProgressItemModel {
  public id: number
  public title: string
  public progress: boolean
  public count: number
  public required: boolean

  constructor(
    id: number,
    title: string,
    progress: boolean,
    count: number = 0,
    required: boolean = false,
  ) {
    this.id = id
    this.title = title
    this.progress = progress
    this.count = count
    this.required = required
  }

  static fromMap(data: any): ProjectProgressItemModel {
    return new ProjectProgressItemModel(
      data.id,
      data.title,
      Boolean(data.progress),
      Number(data.count ?? 0),
      Boolean(data.required),
    )
  }

  static example: ProjectProgressItemModel[] = [
    new ProjectProgressItemModel(ProjectProgressEnum.Certificate, 'Certificate', true),
    new ProjectProgressItemModel(ProjectProgressEnum.Tempalte, 'Tempalte', false),
    new ProjectProgressItemModel(ProjectProgressEnum.Employee, 'Employee', false),
    new ProjectProgressItemModel(ProjectProgressEnum.Heirarchy, 'Positions', false),
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
    new ProjectProgressItemModel(ProjectProgressEnum.Equipment, 'Equipment', false),
    new ProjectProgressItemModel(ProjectProgressEnum.Team, 'Team', false),
    new ProjectProgressItemModel(ProjectProgressEnum.RootCause, 'Root Cause', false),
    new ProjectProgressItemModel(ProjectProgressEnum.DrillType, 'Drill Type', false),
    new ProjectProgressItemModel(ProjectProgressEnum.PpeItem, 'PPE Item', false),
  ]
}
