import type Params from '@/base/core/params/params'

export default class RolesOrganizationEmployeeParams implements Params {
  role_id: number

  constructor(role_id: number) {
    this.role_id = role_id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['role_id'] = this.role_id
    return data
  }
}
