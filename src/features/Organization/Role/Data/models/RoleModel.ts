import TitleInterface from '@/base/Data/Models/title_interface'
import RolePermissionModel from './RolePermissionModel'

export default class RoleModel extends TitleInterface {
  public id: number
  public permissions: RolePermissionModel[]
  public title: string
  public roleId: number
  constructor(id: number, permissions: RolePermissionModel[], title: string, roleId: number) {
    super({ id })
    this.id = id
    this.permissions = permissions
    this.title = title
    this.roleId = roleId
  }

  static fromMap(data: any): RoleModel {
    return new RoleModel(
      data.id,
      data.permissions?.map((permission: any) => RolePermissionModel.fromMap(permission)) ?? [],
      data.role,
      data.role_id,
    )
  }
}
