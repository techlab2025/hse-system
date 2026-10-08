import AddOrganizationCertificateParams, {
  type OrganizationCertificateFields,
} from './addOrganizationCertificateParams'

export default class EditOrganizationCertificateParams extends AddOrganizationCertificateParams {
  constructor(
    public id: number,
    fields: OrganizationCertificateFields,
  ) {
    super(fields)
  }

  override toMap(): Record<string, string | boolean | number> {
    const data: Record<string, string | boolean | number> = {
      ...super.toMap(),
      certificate_id: this.id,
    }
    // Keep the stored file when editing without uploading a replacement.
    if (this.fields.certificate_file && !this.fields.certificate_file.startsWith('data:')) {
      delete data.certificate_file
    }
    return data
  }
}
