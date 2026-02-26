export default class EmployeeCertificatesModel {
  public total: number
  public active: number
  public inactive: number
  public expired: number

  constructor(total: number, active: number, inactive: number, expired: number) {
    this.total = total
    this.active = active
    this.inactive = inactive
    this.expired = expired
  }

  static fromMap(data: any): EmployeeCertificatesModel {
    return new EmployeeCertificatesModel(
      data.total,
      data.active,
      data.inactive,
      data.expired,
    )
  }
}
