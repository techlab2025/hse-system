import TitleInterface from '@/base/Data/Models/title_interface'

type InductionEmployeeResponse = {
  id?: number | null
  organization_employee_id?: number | InductionEmployeeResponse | null
  organisation_employee_id?: number | InductionEmployeeResponse | null
  name?: string | null
  title?: string | null
  phone?: string | null
  email?: string | null
  organization_id?: number | null
  organization_name?: string | null
  organization_employee?: InductionEmployeeResponse
  organisation_employee?: InductionEmployeeResponse
}

export default class InductionEmployeeModel extends TitleInterface {
  public id: number
  public name: string
  public phone: string
  public email: string
  public organizationName: string
  public displayTitle: string
  public displaySubtitle: string
  public initials: string

  constructor(id: number, name: string, phone: string, email: string, organizationName: string) {
    const displayTitle = name || (id ? '#' + id : '-')
    const displaySubtitle = email || phone || organizationName || (id ? '#' + id : '')
    super({ id, title: displayTitle, name: displayTitle, subtitle: displaySubtitle })
    this.id = id
    this.name = displayTitle
    this.phone = phone
    this.email = email
    this.organizationName = organizationName
    this.displayTitle = displayTitle
    this.displaySubtitle = displaySubtitle
    this.initials = displayTitle
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
  }

  static fromMap(data: Record<string, unknown>): InductionEmployeeModel {
    const row = data as InductionEmployeeResponse
    const nestedEmployee =
      typeof row.organization_employee_id === 'object' && row.organization_employee_id
        ? row.organization_employee_id
        : typeof row.organisation_employee_id === 'object' && row.organisation_employee_id
          ? row.organisation_employee_id
          : row.organization_employee ?? row.organisation_employee ?? row
    const id = Number(
      (typeof row.organization_employee_id === 'number' ? row.organization_employee_id : null) ??
        (typeof row.organisation_employee_id === 'number' ? row.organisation_employee_id : null) ??
        nestedEmployee.id ??
        row.id ??
        0,
    )
    const name = row.name ?? nestedEmployee.name ?? nestedEmployee.title ?? (id ? '#' + id : '')

    return new InductionEmployeeModel(
      id,
      name ?? '',
      nestedEmployee.phone ?? row.phone ?? '',
      row.email ?? nestedEmployee.email ?? '',
      nestedEmployee.organization_name ?? row.organization_name ?? '',
    )
  }
}
