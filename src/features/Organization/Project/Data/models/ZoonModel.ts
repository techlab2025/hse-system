import TitleInterface from '@/base/Data/Models/title_interface'
// import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class ZoonModel {
  public id: number
  public title: string
  public location: location

  constructor(id: number, title: string, location: location) {
    this.id = id
    this.title = title
    this.location = location
  }

  static fromMap(data: any): ZoonModel {
    return new ZoonModel(data.id, data.title, data.location)
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    // console.log(data, 'data in get title');

    return new TitleInterface({
      id: data?.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}


interface location {
  id: number
  title: string
}
