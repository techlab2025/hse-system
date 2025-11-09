


import EmployeeHierarchyModel from './EmployeeHierarchyModel'
import ProjectModel from './ProjectModel'
import LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import LocationHierarchyModel from './LocationHierarchyModel'

export default class ProjectLocationModel {
    public locationId: number
    public locationTitle: string
    public hierarchies: EmployeeHierarchyModel[]
    public projectLocationId: number
    public project: ProjectModel | null
    public location: LocationDetailsModel | null


    constructor(locationId: number, locationTitle: string, hierarchies: EmployeeHierarchyModel[], projectLocationId: number, project: ProjectModel | null, location: LocationDetailsModel | null) {
        this.locationId = locationId
        this.locationTitle = locationTitle
        this.hierarchies = hierarchies
        this.projectLocationId = projectLocationId
        this.project = project
        this.location = location

    }

    static fromMap(data: any): ProjectLocationModel {
        return new ProjectLocationModel(
            data.location_id,
            data.location_title,
            data.hierarchies?.map((item: any) => EmployeeHierarchyModel.fromMap(item)),
            data?.project_location_id,
            data?.project ? ProjectModel.fromMap(data?.project) : null,
            data?.location ? LocationDetailsModel.fromMap(data?.location) : null,
        )
    }
}
