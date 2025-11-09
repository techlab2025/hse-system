// import TitleInterface from '@/base/Data/Models/title_interface'
import ProjectModel from './ProjectModel'
import LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import LocationHierarchyModel from './LocationHierarchyModel'

export default class HierarchyEmployeeModel {
    public project_location_hierarchy_employee_id: number
    public project: ProjectModel
    public location: LocationDetailsModel
    public hierarchy: LocationHierarchyModel[]

    constructor(project_location_hierarchy_employee_id: number, project: ProjectModel, location: LocationDetailsModel, hierarchy: LocationHierarchyModel[]) {
        this.project_location_hierarchy_employee_id = project_location_hierarchy_employee_id
        this.project = project
        this.location = location
        this.hierarchy = hierarchy
    }

    static fromMap(data: any): HierarchyEmployeeModel {
        return new HierarchyEmployeeModel(
            data.project_location_hierarchy_employee_id,
            ProjectModel.fromMap(data.project),
            LocationDetailsModel.fromMap(data.location),
            data.hierarchy.map((item: any) => LocationHierarchyModel.fromMap(item)),
        )
    }
}
