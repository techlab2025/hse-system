import TitleInterface from '@/base/Data/Models/title_interface'

type InductionEmployeeResponse = {
  id?: number | null
  organization_employee_id?: number | null
  organisation_employee_id?: number | null
  name?: string | null
  title?: string | null
  phone?: string | null
  email?: string | null
  organization_employee?: InductionEmployeeResponse
  organisation_employee?: InductionEmployeeResponse
}

export default class InductionEmployeeModel extends TitleInterface {
  public id: number
  public name: string
  public phone: string
  public email: string

  constructor(id: number, name: string, phone: string, email: string) {
    super({ id, title: name, name, subtitle: email })
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
  }

  static fromMap(data: Record<string, unknown>): InductionEmployeeModel {
    const row = data as InductionEmployeeResponse
    const employee = row.organization_employee ?? row.organisation_employee ?? row
    const id = Number(row.organization_employee_id ?? row.organisation_employee_id ?? employee.id ?? row.id ?? 0)
    const name = row.name ?? employee.name ?? employee.title ?? (id ? '#' + id : '')

    return new InductionEmployeeModel(
      id,
      name ?? '',
      employee.phone ?? row.phone ?? '',
      row.email ?? employee.email ?? '',
    )
  }
}
