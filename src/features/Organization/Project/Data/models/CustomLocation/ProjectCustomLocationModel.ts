import TitleModel from '@/base/core/Models/title_model'
import type ProjectLocationZoneModel from './ProjectLocationZoneModel'
import ProjectLocationEmployeeModel from './ProjectLocationEmployeeModel'
import ProjectLocationTeamModel from './ProjectLocationTeamModel'
import ProjectLocationEquipmentModel from './ProjectLocationEquipmentModel'
import ProjectLocationHierarchyModel from './ProjectLocationHierarchyModel'

export default class ProjectCustomLocationModel extends TitleModel {
  public projectLocationId: number
  public locationZones: ProjectLocationZoneModel[]
  public locationHierarchy: ProjectLocationHierarchyModel[]
  public locationEmplyees: ProjectLocationEmployeeModel[]
  public locationTeams: ProjectLocationTeamModel[]
  public locationEquipments: ProjectLocationEquipmentModel[]

  constructor(
    projectLocationId: number,
    id: number,
    title: string,
    locationZones: ProjectLocationZoneModel[],
    locationHierarchy: ProjectLocationHierarchyModel[],
    locationEmplyees: ProjectLocationEmployeeModel[],
    locationTeams: ProjectLocationTeamModel[],
    locationEquipments: ProjectLocationEquipmentModel[],
  ) {
    super(title, id)
    this.projectLocationId = projectLocationId
    this.locationZones = locationZones
    this.locationHierarchy = locationHierarchy
    this.locationEmplyees = locationEmplyees
    this.locationTeams = locationTeams
    this.locationEquipments = locationEquipments
  }

  static fromMap(data: any): ProjectCustomLocationModel {
    return new ProjectCustomLocationModel(
      data.project_location_id,
      data.location_id,
      data.location_title,
      data.project_location_zoons,
      data.project_location_hierarchies?.map((item) => ProjectLocationHierarchyModel.fromMap(item)),
      data.project_location_hierarchy_employees?.map((item: any) =>
        ProjectLocationEmployeeModel.fromMap(item),
      ),
      data.project_location_teams?.map((item: any) => ProjectLocationTeamModel.fromMap(item)),
      data.project_location_equipments,
    )
  }
}
