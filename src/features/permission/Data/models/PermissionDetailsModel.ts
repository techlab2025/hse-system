

export default class  PermissionDetailsModel {
  public permission: { id: number, permission: string }[]

  constructor(
    permission: { id: number, permission: string }[]
  ) {

    this.permission = permission
  }

  static getLocale(): string {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en'
  }

  static fromMap(data: any): PermissionDetailsModel {
    return new PermissionDetailsModel(

      data || [],
    )
  }




}
