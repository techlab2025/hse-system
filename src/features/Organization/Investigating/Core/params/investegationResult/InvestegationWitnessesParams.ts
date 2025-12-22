import type Params from '@/base/core/params/params'

export default class InvestegationWitnessesParams implements Params {
  public witnessesStatements?: string
  public organizationEmployeeId?: number
  public employeeName?: string

  constructor(
    witnessesStatements?: string,
    organizationEmployeeId?: number,
    employeeName?: string,
  ) {
    this.witnessesStatements = witnessesStatements
    this.organizationEmployeeId = organizationEmployeeId
    this.employeeName = employeeName
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['witnesses_statements'] = this.witnessesStatements
    data['organization_employee_id'] = this.organizationEmployeeId
    data['employee_name'] = this.employeeName

    return data
  }
}
