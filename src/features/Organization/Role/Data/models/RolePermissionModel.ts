
export default class RolePermissionModel {
  description: string
  displayName: string
  id: number
  name: string
  permission: string
  permissionId: number

  constructor(
    description: string,
    displayName: string,
    id: number,
    name: string,
    permission: string,
    permissionId: number,
  ) {
    this.description = description
    this.displayName = displayName
    this.id = id
    this.name = name
    this.permission = permission
    this.permissionId = permissionId
  }

  static fromMap(data: any): RolePermissionModel {
    return new RolePermissionModel(
      data.description,
      data.display_name,
      data.id,
      data.name,
      data.permission,
      data.permission_id,
    )
  }
}
