import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class OrganizationDetailsModel {
  public id: string
  public name: string
  public phone: string
  public email: string
  public image: string
  public url: string

  constructor(id: string, name: string, phone: string, email: string, image: string , url: string) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.image = image
    this.url = url
  }

  static fromMap(data: any): OrganizationDetailsModel {
    return new OrganizationDetailsModel(data.id, data.name, data.phone, data.email, data.image, data.url)
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
