/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectProgressStatusEnum } from '../../../Core/Enums/UpdatedProjectFlow/ProjectProgressStatusEnum'
import ProjectFlowContractorModel from './ProjectFlowContractorModel'
import ProjectFlowEquipmentModel from './ProjectFlowEquipmentModel'
import ProjectFlowHierarchyModel from './ProjectFlowHierarchyModel'
import ProjectFlowHolidaysModel from './ProjectFlowHolidaysModel'
import ProjectFlowLocationModel from './ProjectFlowLocationModel'
import ProjectFlowMethodModel from './ProjectFlowMethodModel'
import ProjectFlowPartnerModel from './ProjectFlowPartnerModel'
import ProjectFlowProjectLocationModel from './ProjectFlowProjectLocationModel'
import ProjectFlowProjectZoonModel from './ProjectFlowProjectZoonModel'
import ProjectFlowTeamModel from './ProjectFlowTeamModel'
import ProjectFlowZoonModel from './ProjectFlowZoonModel'

export default class ProjectFlowResponseModel {
  constructor(
    public readonly id: number,
    public readonly projectId: number,
    public readonly title: string,
    public readonly description: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly serialNumber: string,
    public readonly serialName: string,
    public readonly observationsCount: number,
    public readonly observationHazardsCount: number,
    public readonly observationAccidentsCount: number,
    public readonly investigationCount: number,
    public readonly equipmentCount: number,
    public readonly assignedLocationsCount: number,
    public readonly assignedZonesCount: number,
    public readonly assignedEmployeesCount: number,
    public readonly inspectionsCount: number,
    public readonly projectStatus: ProjectProgressStatusEnum,
    public readonly projectProgress: number,
    public readonly cost: string,
    public readonly hasZoon: boolean,
    public readonly holidays: ProjectFlowHolidaysModel,
    public readonly partner: ProjectFlowPartnerModel,
    public readonly locations: ProjectFlowLocationModel[],
    public readonly projectLocations: ProjectFlowProjectLocationModel[],
    public readonly methods: ProjectFlowMethodModel[],
    public readonly zoons: ProjectFlowZoonModel[],
    public readonly projectZoons: ProjectFlowProjectZoonModel[],
    public readonly projectLocationHierarchies: ProjectFlowHierarchyModel[],
    public readonly projectLocationTeams: ProjectFlowTeamModel[],
    public readonly projectZoonEquipments: ProjectFlowEquipmentModel[],
    public readonly contractors: ProjectFlowContractorModel[],
  ) {}

  static fromMap(data: Record<string, any>): ProjectFlowResponseModel {
    return new ProjectFlowResponseModel(
      data.id ?? data.project_id ?? data.project?.id,
      data.project_id ?? data.id ?? data.project?.id,
      data.title ?? '',
      data.description ?? '',
      data.start_date ?? '',
      data.end_date ?? '',
      data.serial_number ?? '',
      data.serial_name ?? '',
      data.observations_count ?? 0,
      data.observation_hazards_count ?? 0,
      data.observation_accidents_count ?? 0,
      data.investigation_count ?? 0,
      data.equipment_count ?? 0,
      data.assigned_locations_count ?? 0,
      data.assigned_zones_count ?? 0,
      data.assigned_employees_count ?? 0,
      data.inspections_count ?? 0,
      data.project_status,
      data.project_progress ?? 0,
      data.cost ?? '',
      data.has_zoon ?? false,
      ProjectFlowHolidaysModel.fromMap(data.holidays ?? {}),
      ProjectFlowPartnerModel.fromMap(data.partner ?? {}),
      (data.locations ?? []).map(ProjectFlowLocationModel.fromMap),
      (data.project_locations ?? []).map(ProjectFlowProjectLocationModel.fromMap),
      (data.methods ?? []).map(ProjectFlowMethodModel.fromMap),
      (data.zoons ?? []).map(ProjectFlowZoonModel.fromMap),
      (data.project_zoons ?? []).map(ProjectFlowProjectZoonModel.fromMap),
      (data.project_location_hierarchies ?? []).map(ProjectFlowHierarchyModel.fromMap),
      (data.project_location_teams ?? []).map(ProjectFlowTeamModel.fromMap),
      (data.project_zoon_equipments ?? []).map(ProjectFlowEquipmentModel.fromMap),
      (data.contractors ?? []).map(ProjectFlowContractorModel.fromMap),
    )
  }
}
