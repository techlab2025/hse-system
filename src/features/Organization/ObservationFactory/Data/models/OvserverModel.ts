import type TitleInterface from '@/base/Data/Models/title_interface'
import acc from '@/assets/images/acc.png'

export default class OvserverModel {
  public id: number
  public name: string
  public phone: string
  public email: string
  public isMaster: number
  public image: string
  public type: number
  public languages: TitleInterface[]
  public permissions: string[]
  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    isMaster: number,
    image: string,
    type: number,
    languages: TitleInterface[],
    permissions: string[],
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.isMaster = isMaster
    this.image = image
    this.type = type
    this.languages = languages
    this.permissions = permissions
  }

  static fromMap(data: any): OvserverModel {
    return new OvserverModel(
      data?.id,
      data.name,
      data.phone,
      data.email,
      data.is_master,
      data.image,
      data.type,
      data.languages,
      data.permissions,
    )
  }
  static example :OvserverModel = new OvserverModel(
    1,
    'Mohab Mohamed',
    '01007599123',
    'mohab@gmail.com',
    1,
    acc,
    1,
    [],
    [],
  )
}
