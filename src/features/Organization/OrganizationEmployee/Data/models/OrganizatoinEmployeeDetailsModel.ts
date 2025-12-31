import TitleInterface from '@/base/Data/Models/title_interface'
import HierarchyEmployeeModel from '@/features/Organization/Project/Data/models/LocationHierarchyEmployeeModel'
import RoleDetailsModel from '@/features/Organization/Role/Data/models/RoleDetailsModel'
import acc from '@/assets/images/acc.png'

export default class OrganizatoinEmployeeDetailsModel {
  public id: number
  public name: string
  public phone: string
  public email: string
  public is_master: number
  public image: null
  public hierarchy: TitleInterface[]
  public roles: RoleDetailsModel[]

  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    is_master: number,
    image: null,
    hierarchy: TitleInterface[],
    roles: RoleDetailsModel[],
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.is_master = is_master
    this.image = image
    this.hierarchy = hierarchy
    this.roles = roles
  }

  static fromMap(data: any): OrganizatoinEmployeeDetailsModel {
    return new OrganizatoinEmployeeDetailsModel(
      data.id,
      data.name,
      data.phone,
      data.email,
      data.is_master,
      data.image,
      data.hierarchy?.map((item: any) => this.getTitle(item)) || [],
      // data.hierarchy?.map((item: any) => HierarchyEmployeeModel.fromMap(item)),
      data.roles?.map((roleData: any) => RoleDetailsModel.fromMap(roleData)),
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }

  static example: OrganizatoinEmployeeDetailsModel = new OrganizatoinEmployeeDetailsModel(
    10,
    'Mohab',
    '01007599132',
    'Mohab@gmail.com',
    1,
    acc,
    [
      {
        id: 1,
        title: 'Egypt',
      },
    ],
    [],
  )
}
