
import ProjectLocationModel from './projectLocation'

export default class LocationHierarchyModel {
    public projectLocationHierarchyId: number
    public projectLocation: ProjectLocationModel


    constructor(projectLocationHierarchyId: number, projectLocation: ProjectLocationModel,) {

        this.projectLocationHierarchyId = projectLocationHierarchyId
        this.projectLocation = projectLocation

    }

    static fromMap(data: any): LocationHierarchyModel {
        return new LocationHierarchyModel(
            data.project_location_hierarchy_id,
            ProjectLocationModel.fromMap(data.project_location),
        )
    }
}
