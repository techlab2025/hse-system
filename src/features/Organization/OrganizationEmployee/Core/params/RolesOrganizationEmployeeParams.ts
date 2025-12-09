import type Params from '@/base/core/params/params'

export default class RolesOrganizationEmployeeParams implements Params {
  roleId: number

  constructor(roleId: number) {
    this.roleId = roleId
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['role_id'] = this.roleId
    return data
  }
}
