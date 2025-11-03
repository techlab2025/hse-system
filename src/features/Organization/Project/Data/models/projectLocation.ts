import ProjectModel from './ProjectModel'
import LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'

export default class ProjectLocationModel {
    public project_location_id: number
    public project: ProjectModel
    public location: LocationDetailsModel

    constructor(project_location_id: number, project: ProjectModel, location: LocationDetailsModel) {
        this.project_location_id = project_location_id
        this.project = project
        this.location = location
    }

    static fromMap(data: any): ProjectLocationModel {
        return new ProjectLocationModel(
            data.project_location_id,
            ProjectModel.fromMap(data.project),
            LocationDetailsModel.fromMap(data.location),
        )
    }
}
