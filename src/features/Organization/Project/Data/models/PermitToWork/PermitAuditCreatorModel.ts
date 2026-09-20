import PermitAuditCertificateModel from './PermitAuditCertificateModel'
import PermitAuditHierarchyModel from './PermitAuditHierarchyModel'

export default class PermitAuditCreatorModel {
  constructor(
    public id: number,
    public organizationEmployeeId: number,
    public name: string,
    public serialName: string,
    public organizationId: number,
    public phone: string,
    public email: string,
    public image: string,
    public employeeType: number,
    public hierarchy: PermitAuditHierarchyModel[],
    public employeeCertificates: PermitAuditCertificateModel[],
    public certificates: PermitAuditCertificateModel[],
  ) {}

  static fromMap(data: any): PermitAuditCreatorModel {
    return new PermitAuditCreatorModel(
      Number(data?.id ?? 0),
      Number(data?.organization_employee_id ?? 0),
      data?.name ?? '',
      data?.serial_name ?? '',
      Number(data?.organization_id ?? 0),
      data?.phone ?? '',
      data?.email ?? '',
      data?.image ?? '',
      Number(data?.employee_type ?? 0),
      (data?.hierarchy ?? []).map((item: any) => PermitAuditHierarchyModel.fromMap(item)),
      (data?.employee_certificates ?? []).map((item: any) =>
        PermitAuditCertificateModel.fromMap(item),
      ),
      (data?.certificates ?? []).map((item: any) => PermitAuditCertificateModel.fromMap(item)),
    )
  }
}
