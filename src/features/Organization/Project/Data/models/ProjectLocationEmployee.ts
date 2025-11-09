
import type LocationEmployeesModel from './LocationEmployees'

export default class ProjectLocationEmployeesModel {
  public projectLocationId: number
  public locationId: number
  public locationTitle: string
  public projectLocationEmployees: LocationEmployeesModel[]


  constructor(
    projectLocationId: number,
    locationId: number,
    locationTitle: string,
    projectLocationEmployees: LocationEmployeesModel[]
  ) {
    this.projectLocationId = projectLocationId
    this.locationId = locationId
    this.locationTitle = locationTitle
    this.projectLocationEmployees = projectLocationEmployees
  }

  static fromMap(data: any): ProjectLocationEmployeesModel {
    return new ProjectLocationEmployeesModel(
      data.project_location_id,
      data.location_id,
      data?.location_title,
      data?.project_location_employees,
    )
  }
}



