import type Params from '@/base/core/params/params'
import type PermissionRolrParamsParams from './PermissionRoleParams'

export default class AddRoleParams implements Params {
  role: string
  roleName: string
  permission: PermissionRolrParamsParams[]
  allowForOrganizations: boolean

  constructor(
    role: string,
    roleName: string,
    permission: PermissionRolrParamsParams[],
    allowForOrganizations: boolean,
  ) {
    this.role = role
    this.roleName = roleName
    this.permission = permission
    this.allowForOrganizations = allowForOrganizations
  }

  toMap(): Record<
    string,
    | number
    | string
    | string[]
    | number[]
    | any
    | Record<string, string | number[] | string[] | number | any | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | any
      | number[]
      | string[]
      | Record<string, string | number[] | number | string[] | any | Record<string, string>>
    > = {}

    data['name'] = this.role
    data['display_name'] = this.roleName
    if (this.permission)
      data['permission'] = this.permission ? this.permission : []
    data['allow_for_organizations'] = this.allowForOrganizations
    return data
  }
}
