import RolePermissionModel from './RolePermissionModel'

export default class RoleDetailsModel {
  id: number
  permissions: RolePermissionModel[]
  role: string
  roleId: number
  displayName: string
  allowForOrganizations: boolean

  constructor(
    id: number,
    permissions: RolePermissionModel[],
    role: string,
    roleId: number,
    displayName: string,
    allowForOrganizations: boolean,
  ) {
    this.id = id
    this.permissions = permissions
    this.role = role
    this.roleId = roleId
    this.displayName = displayName
    this.allowForOrganizations = allowForOrganizations
  }

  static fromMap(data: any): RoleDetailsModel {
    return new RoleDetailsModel(
      data.id,
      data.permissions.map((item: any) => RolePermissionModel.fromMap(item)),
      data.role,
      data.role_id,
      data.display_name,
      data.allow_for_organizations ,
    )
  }
}
