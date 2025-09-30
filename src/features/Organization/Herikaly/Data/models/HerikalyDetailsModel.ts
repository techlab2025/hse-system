// import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class HerikalyDetailsModel {
  public id: number
  public titles: string[]
  public parent_id: number
  public children: HerikalyDetailsModel[]

  constructor(id: number, titles: string[], parent_id: number, children: HerikalyDetailsModel[]) {
    this.id = id
    this.titles = titles
    this.parent_id = parent_id
    this.children = children
  }

  static fromMap(data: any): HerikalyDetailsModel {
    return new HerikalyDetailsModel(data.id, data.titles, data.parent_id, data.children)
  }

  // static getTitle(data: any) {
  //   const savedLocale = localStorage.getItem('lang')

  //   return new TitleInterface({
  //     id: data.id,
  //     title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
  //   })
  // }
}
