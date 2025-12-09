import type Params from '@/base/core/params/params'


export default class EditRoleParams implements Params {
  id: number
  role: string
  roleName: string
  permission: string[]
  allowForOrganizations: boolean

  constructor(
    id: number,
    role: string,
    roleName: string,
    permission: string[],
    allowForOrganizations: boolean,
  ) {
    this.id = id
    this.role = role
    this.roleName = roleName
    this.permission = permission
    this.allowForOrganizations = allowForOrganizations
  }

  toMap(): Record<
    string,
    | number
    | string
    | any
    | string[]
    | number[]
    | Record<string, string | number[] | string[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | any
      | string[]
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}
    data['role_id'] = this.id
    data['name'] = this.role
    data['display_name'] = this.roleName
    if (this.permission) data['permission'] = this.permission
    data['allow_for_organizations'] = this.allowForOrganizations

    return data
  }
}
