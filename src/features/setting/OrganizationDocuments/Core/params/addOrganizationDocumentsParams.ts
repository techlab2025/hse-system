import type Params from '@/base/core/params/params'

export interface OrganizationDocumentsFields {
  document_title: string
  document_ref: string
  document_version: string
  issue_date: string
  nex_review_date: string
  document_file: string
  notes: string
  document_category_id: number
}

export default class AddOrganizationDocumentsParams implements Params {
  constructor(public fields: OrganizationDocumentsFields) {}

  toMap(): Record<string, string | number> {
    return {
      document_title: this.fields.document_title,
      document_ref: this.fields.document_ref,
      document_version: this.fields.document_version,
      issue_date: this.fields.issue_date,
      nex_review_date: this.fields.nex_review_date,
      document_file: this.fields.document_file,
      notes: this.fields.notes,
      document_category_id: this.fields.document_category_id,
    }
  }
}
