import ProjectModel from './ProjectModel'
import LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import EmployeeHierarchyModel from './EmployeeHierarchyModel'

export default class LocationHierarchyModel {
    public project_location_hierarchy_id: number
    public project: ProjectModel
    public location: LocationDetailsModel
    public hierarchy: EmployeeHierarchyModel[]

    constructor(project_location_hierarchy_id: number, project: ProjectModel, location: LocationDetailsModel, hierarchy: EmployeeHierarchyModel[],) {

        this.project_location_hierarchy_id = project_location_hierarchy_id
        this.project = project
        this.location = location
        this.hierarchy = hierarchy
    }

    static fromMap(data: any): LocationHierarchyModel {
        return new LocationHierarchyModel(
            data.project_location_hierarchy_id,
            ProjectModel.fromMap(data.project),
            LocationDetailsModel.fromMap(data.location),
            data.hierarchy.map((item: any) => EmployeeHierarchyModel.fromMap(item)),
        )
    }
}
