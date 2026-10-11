/* eslint-disable @typescript-eslint/no-explicit-any */
import TitleModel from '@/base/core/Models/title_model'
import ProjectLocationEmployeeModel from './ProjectLocationEmployeeModel'
import ProjectLocationTeamModel from './ProjectLocationTeamModel'
import ProjectLocationEquipmentModel from './ProjectLocationEquipmentModel'
import ProjectLocationHierarchyModel from './ProjectLocationHierarchyModel'
import SohwProjectZoonModel from '../ShowProjectZone'
import ContractorDetailsModel from '@/features/setting/contractor/Data/models/ContractorDetailsModel'

export default class ProjectCustomLocationModel extends TitleModel {
  public projectLocationId: number
  public locationZones: SohwProjectZoonModel[]
  public locationHierarchy: ProjectLocationHierarchyModel[]
  public locationEmplyees: ProjectLocationEmployeeModel[]
  public locationTeams: ProjectLocationTeamModel[]
  public locationEquipments: ProjectLocationEquipmentModel[]
  public locationHierarchies?: any[]
  public contractors: ContractorDetailsModel[]
  constructor(
    projectLocationId: number,
    id: number,
    title: string,
    locationZones: SohwProjectZoonModel[],
    locationHierarchy: ProjectLocationHierarchyModel[],
    locationEmplyees: ProjectLocationEmployeeModel[],
    locationTeams: ProjectLocationTeamModel[],
    locationEquipments: ProjectLocationEquipmentModel[],
    locationHierarchies: any[] = [],
    contractors: ContractorDetailsModel[] = [],
  ) {
    super(title, id)
    this.projectLocationId = projectLocationId
    this.locationZones = locationZones
    this.locationHierarchy = locationHierarchy
    this.locationEmplyees = locationEmplyees
    this.locationTeams = locationTeams
    this.locationEquipments = locationEquipments
    this.locationHierarchies = locationHierarchies
    this.contractors = contractors
  }

  static fromMap(data: any): ProjectCustomLocationModel {
    const contractorItems =
      data?.project_location_contractors ??
      data?.project_contractors ??
      data?.contractors ??
      data?.location_contractors
    const contractors = Array.isArray(contractorItems)
      ? contractorItems
      : data?.name || data?.company_email
        ? [data]
        : []

    return new ProjectCustomLocationModel(
      data.project_location_id ?? 0,
      data.location_id ?? 0,
      data.location_title ?? '',
      data.project_location_zoons?.map((item: any) => SohwProjectZoonModel.fromMap(item)) ?? [],
      data.project_location_hierarchies?.map((item) => ProjectLocationHierarchyModel.fromMap(item)) ?? [],
      data.project_location_hierarchy_employees?.map((item: any) =>
        ProjectLocationEmployeeModel.fromMap(item),
      ) ?? [],
      data.project_location_teams?.map((item: any) => ProjectLocationTeamModel.fromMap(item)) ?? [],
      data.project_location_equipments ?? [],
      data?.project_location_hierarchies ?? [],
      contractors.map((item: any) => ContractorDetailsModel.fromMap(item)),
    )
  }

  static example: ProjectCustomLocationModel = new ProjectCustomLocationModel(
    1,
    1,
    'Location',
    [SohwProjectZoonModel.example],
    [ProjectLocationHierarchyModel.example],
    [
      {
        ...ProjectLocationEmployeeModel.example,
        name: 'ahmed hawam',
        hierarchy: [ProjectLocationHierarchyModel.example],
      },
      {
        ...ProjectLocationEmployeeModel.example,
        name: 'omar hussien',
        hierarchy: [ProjectLocationHierarchyModel.example],
      },
    ],
    [
      ProjectLocationTeamModel.example,
      {
        ...ProjectLocationTeamModel.example,
        Employees: [ProjectLocationEmployeeModel.example, ProjectLocationEmployeeModel.example],
      },
    ],
    [ProjectLocationEquipmentModel.example],
    [],
    [ContractorDetailsModel.example],
  )
}
