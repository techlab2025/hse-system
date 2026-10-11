import type Params from '@/base/core/params/params'

export interface OrganizationCertificateFields {
  certification_name: string
  issuing_body: string
  certificate_number: string
  issue_date: string
  hase_expiry_date: boolean
  expire_date?: string
  certificate_file: string
  notes?: string
}

export default class AddOrganizationCertificateParams implements Params {
  constructor(public fields: OrganizationCertificateFields) {}

  toMap(): Record<string, string | boolean | number> {
    const data: Record<string, string | boolean> = {
      certification_name: this.fields.certification_name,
      issuing_body: this.fields.issuing_body,
      certificate_number: this.fields.certificate_number,
      issue_date: this.fields.issue_date,
      hase_expiry_date: this.fields.hase_expiry_date,
      certificate_file: this.fields.certificate_file,
    }
    if (this.fields.hase_expiry_date) data.expire_date = this.fields.expire_date ?? ''
    if (this.fields.notes !== undefined) data.notes = this.fields.notes
    return data
  }
}
