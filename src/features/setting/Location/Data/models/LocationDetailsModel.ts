import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class LocationDetailsModel {
  public id: number

  public titles: { locale: string; title: string }[] // <-- instead of single title
  public code: string
  public parent: TitleInterface | null
  public type: number
  public status: number
  public image: string

  constructor(
    id: number,

    titles: { locale: string; title: string }[],
    code: string,
    parent: TitleInterface | null,
    type: number,
    status: number,
    image: string,
  ) {
    this.id = id
    this.titles = titles
    this.code = code
    this.parent = parent
    this.type = type
    this.status = status
    this.image = image
  }

  static fromMap(data: any): LocationDetailsModel {
    return new LocationDetailsModel(
      data.id,
      data.titles ?? [],
      data.code,
      data.parent ? this.getTitle(data.parent) : null,
      data.type,
      data.status,
      data.image,
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
