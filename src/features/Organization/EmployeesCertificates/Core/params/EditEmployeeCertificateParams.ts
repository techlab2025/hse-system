import type Params from '@/base/core/params/params'
export default class EditEmployeeCertificateParams implements Params {
  id: number
  certificateId: number
  organizationEmployeeId: number
  expiredAt: string

  constructor(
    id: number,
    certificateId: number,
    organizationEmployeeId: number,
    expiredAt: string,
  ) {
    this.id = id
    this.certificateId = certificateId
    this.organizationEmployeeId = organizationEmployeeId
    this.expiredAt = expiredAt
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['EmployeeCertificate_type_id'] = this.id
    data['certificate_id'] = this.certificateId
    data['organization_employee_id'] = this.organizationEmployeeId
    data['expired_at'] = this.expiredAt

    return data
  }
}
