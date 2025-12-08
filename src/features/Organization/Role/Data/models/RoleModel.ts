import TitleInterface from '@/base/Data/Models/title_interface'

export default class RoleModel extends TitleInterface {
  public id: number
  public title: string
  public permissions: string[]
  constructor(
    id: number,
    title: string,
    phone: string,
    permissions: string[],
  ) {
    super({ id, title })
    this.id = id
    this.title = title
    this.permissions = permissions
  }

  static fromMap(data: any): RoleModel {
    return new RoleModel(
      data.id,
      data.title,
      data.phone,
      data.permissions,
    )
  }
}
