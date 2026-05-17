import type Params from '@/base/core/params/params'

export default class AddCertificateToHierarchyParams implements Params {
  hieararchyId: number
  certificateId?: number

  constructor(data: { hieararchyId: number; certificateId: number }) {
    this.hieararchyId = data.hieararchyId
    this.certificateId = data.certificateId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['hierarchy_id'] = this.hieararchyId
    data['certificate_id'] = this.certificateId

    return data
  }
}
