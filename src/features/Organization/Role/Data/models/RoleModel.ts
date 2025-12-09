import TitleInterface from '@/base/Data/Models/title_interface'

export default class RoleModel extends TitleInterface {
  public id: number
  public permissions: string[]
  public title: string
  public roleId: number
  constructor(id: number, permissions: string[], title: string, roleId: number) {
    super({ id })
    this.id = id
    this.permissions = permissions
    this.title = title
    this.roleId = roleId
  }

  static fromMap(data: any): RoleModel {
    return new RoleModel(data.id, data.permissions, data.role, data.role_id)
  }
}
