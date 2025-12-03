
export default class ProjectLocationEmployeeModel {
  public projectLocationHierarchyEmployeeId: number
  public projectLocationId: number
  public employeeId: number
  public name: string
  public email: string
  public image: string
  constructor(
    projectLocationHierarchyEmployeeId: number,
    projectLocationId: number,
    employeeId: number,
    name: string,
    email: string,
    image: string,
  ) {
    this.projectLocationHierarchyEmployeeId = projectLocationHierarchyEmployeeId
    this.projectLocationId = projectLocationId
    this.employeeId = employeeId
    this.name = name
    this.email = email
    this.image = image
  }

  static fromMap(data: any): ProjectLocationEmployeeModel {
    return new ProjectLocationEmployeeModel(
      data.project_location_hierarchy_employee_id,
      data.project_location_id,
      data.employee_id,
      data.name,
      data.email,
      data.image,
    )
  }
}
