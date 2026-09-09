/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ProjectFlowContractorModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly phone: string,
    public readonly companyAddress: string,
    public readonly companyPhone: string,
    public readonly companyEmail: string,
    public readonly contactPerson: string,
    public readonly contactPersonPhone: string,
    public readonly contactPersonEmail: string,
    public readonly status: number,
    public readonly expiryDate: string,
    public readonly serialNumber: string,
    public readonly serial: string,
    public readonly contractFile: string,
  ) {}

  static fromMap(data: Record<string, any>) {
    return new ProjectFlowContractorModel(
      data.id,
      data.name ?? '',
      data.phone ?? '',
      data.company_address ?? '',
      data.company_phone ?? '',
      data.company_email ?? '',
      data.contact_person ?? '',
      data.contact_person_phone ?? '',
      data.contact_person_email ?? '',
      data.status,
      data.expiry_date ?? '',
      data.serial_number ?? '',
      data.serial ?? '',
      data.contract_file ?? '',
    )
  }
}
