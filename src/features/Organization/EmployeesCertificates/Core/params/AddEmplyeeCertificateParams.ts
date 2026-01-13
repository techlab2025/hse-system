import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class AddEmployeeCertificateParams implements Params {
  certificateId: number
  organizationEmployeeId: number
  expiredAt: string
  notes: string
  certificate_image: string

  public static readonly validation = new ClassValidation().setRules({
    certificateId: { required: true },
    organizationEmployeeId: { required: true },
  })

  constructor(
    certificateId: number,
    organizationEmployeeId: number,
    expiredAt: string,
    notes: string,
    certificate_image: string,
  ) {
    this.certificateId = certificateId
    this.organizationEmployeeId = organizationEmployeeId
    this.expiredAt = expiredAt
    this.notes = notes
    this.certificate_image = certificate_image
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
    data['expired_at'] = formatJoinDate(this.expiredAt)
    data['notes'] = this.notes
    data['certificate_image'] = this.certificate_image

    return data
  }

  validate() {
    return AddEmployeeCertificateParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddEmployeeCertificateParams.validation.validateOrThrow(this)
  }
}
