import type Params from '@/base/core/params/params'

export default class OrganizationEmployeeDefaultProjectParams implements Params {
  constructor(
    public organizationEmployeeId: number | string,
    public defaultProjectId: number | string | null,
  ) {}

  toMap() {
    return {
      organization_employee_id: this.organizationEmployeeId,
      default_project_id: this.defaultProjectId,
    }
  }
}
