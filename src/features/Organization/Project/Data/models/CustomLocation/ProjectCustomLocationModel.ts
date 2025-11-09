import TitleModel from '@/base/core/Models/title_model'
import type ProjectLocationZoneModel from './ProjectLocationZoneModel'
import type ProjectLocationEmployeeModel from './ProjectLocationEmployeeModel'
import type ProjectLocationTeamModel from './ProjectLocationTeamModel'
import type ProjectLocationEquipmentModel from './ProjectLocationEquipmentModel'
import type ProjectLocationHierarchyModel from './ProjectLocationHierarchyModel'

export default class ProjectCustomLocationModel extends TitleModel {
  public locationZones: ProjectLocationZoneModel[]
  public locationHierarchy: ProjectLocationHierarchyModel[]
  public locationEmplyees: ProjectLocationEmployeeModel[]
  public locationTeams: ProjectLocationTeamModel[]
  public locationEquipments: ProjectLocationEquipmentModel[]

  constructor(
    id: number,
    title: string,
    locationZones: ProjectLocationZoneModel[],
    locationHierarchy: ProjectLocationHierarchyModel[],
    locationEmplyees: ProjectLocationEmployeeModel[],
    locationTeams: ProjectLocationTeamModel[],
    locationEquipments: ProjectLocationEquipmentModel[],
  ) {
    super(title, id)
    this.locationZones = locationZones
    this.locationHierarchy = locationHierarchy
    this.locationEmplyees = locationEmplyees
    this.locationTeams = locationTeams
    this.locationEquipments = locationEquipments
  }

  static fromMap(data: any): ProjectCustomLocationModel {
    return new ProjectCustomLocationModel(
      data.id,
      data.title,
      data.locationZones,
      data.locationHierarchy,
      data.locationEmplyees,
      data.locationTeams,
      data.locationEquipments,
    )
  }
}
