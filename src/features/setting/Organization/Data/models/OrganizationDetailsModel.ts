import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class OrganizationDetailsModel {
  public id: number
  public name: string
  public phone: string
  public email: string
  public image: string
  public website_link: string
  public industry: TitleInterface
  public languages: TitleInterface[]

  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    image: string,
    website_link: string,
    industry: TitleInterface,
    languages: TitleInterface[],
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.image = image
    this.website_link = website_link
    this.industry = industry
    this.languages = languages
  }

  static fromMap(data: any): OrganizationDetailsModel {
    return new OrganizationDetailsModel(
      data.id,
      data.name,
      data.phone,
      data.email,
      data.image,
      data.website_link,
      // data.industry
      this.getTitle(data.industry),
      data.languages.length > 0 ? data.languages?.map((language) => this.getTitle(language)) : [],
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
