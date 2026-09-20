export default class PermitAuditHierarchyModel {
  constructor(
    public id: number,
    public title: string,
  ) {}

  static fromMap(data: any): PermitAuditHierarchyModel {
    return new PermitAuditHierarchyModel(Number(data?.id ?? 0), data?.title ?? '')
  }
}
