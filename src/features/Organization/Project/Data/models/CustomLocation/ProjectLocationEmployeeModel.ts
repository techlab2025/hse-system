export default class ProjectLocationEmployeeModel {
  public projectLocationHierarchyEmployeeId: number
  public projectLocationId: number
  public employeeId: number
  public name: string
  public email: string
  public image: string
  public projectLocationTeamEmployeeId: number
  constructor(
    projectLocationHierarchyEmployeeId: number,
    projectLocationId: number,
    employeeId: number,
    name: string,
    email: string,
    image: string,
    projectLocationTeamEmployeeId: number,
  ) {
    this.projectLocationHierarchyEmployeeId = projectLocationHierarchyEmployeeId
    this.projectLocationId = projectLocationId
    this.employeeId = employeeId
    this.name = name
    this.email = email
    this.image = image
    this.projectLocationTeamEmployeeId = projectLocationTeamEmployeeId
  }

  static fromMap(data: any): ProjectLocationEmployeeModel {
    return new ProjectLocationEmployeeModel(
      data.project_location_hierarchy_employee_id,
      data.project_location_id,
      data.employee_id,
      data.name,
      data.email,
      data.image,
      data.project_location_team_employee_id,
    )
  }
}
