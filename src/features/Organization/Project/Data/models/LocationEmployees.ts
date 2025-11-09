

export default class LocationEmployeesModel {
  public projectLocationEmployeeId: number
  public employeeId: number
  public name: number
  public image: number

  constructor(projectLocationEmployeeId: number, employeeId: number, name: number, image: number) {
    this.projectLocationEmployeeId = projectLocationEmployeeId
    this.employeeId = employeeId
    this.name = name
    this.image = image
  }

  static fromMap(data: any): LocationEmployeesModel {
    return new LocationEmployeesModel(
      data.project_location_employee_id,
      data.employee_id,
      data?.name,
      data?.image,
    )
  }
}
