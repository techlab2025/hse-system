import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddEmployeeCertificateParams implements Params {
  certificateId: number
  organizationEmployeeId: number
  expiredAt: string

  public static readonly validation = new ClassValidation().setRules({
    certificateId: { required: true },
    organizationEmployeeId: { required: true },
  })

  constructor(certificateId: number, organizationEmployeeId: number, expiredAt: string) {
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

    data['certificate_id'] = this.certificateId
    data['organization_employee_id'] = this.organizationEmployeeId
    data['expired_at'] = this.expiredAt

    return data
  }

  validate() {
    return AddEmployeeCertificateParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddEmployeeCertificateParams.validation.validateOrThrow(this)
  }
}
