import AddOrganizationDocumentsParams, {
  type OrganizationDocumentsFields,
} from './addOrganizationDocumentsParams'

export default class EditOrganizationDocumentsParams extends AddOrganizationDocumentsParams {
  constructor(
    public id: number,
    fields: OrganizationDocumentsFields,
  ) {
    super(fields)
  }

  override toMap(): Record<string, string | number> {
    const data: Record<string, string | number> = { ...super.toMap(), document_id: this.id }
    if (this.fields.document_file && !this.fields.document_file.startsWith('data:')) {
      delete data.document_file
    }
    return data
  }
}
