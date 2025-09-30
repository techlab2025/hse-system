// import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class ProjectZoneDetailsModel {
  public id: number
  public titles: string[]
  public project: {}
  public prorganization_locationoject: {}
  public lat: string
  public lng: string

  constructor(
    id: number,
    titles: string[],
    project: {},
    prorganization_locationoject: {},
    lat: string,
    lng: string,
  ) {
    this.id = id
    this.titles = titles
    this.project = project
    this.prorganization_locationoject = prorganization_locationoject
    this.lat = lat
    this.lng = lng
  }

  static fromMap(data: any): ProjectZoneDetailsModel {
    return new ProjectZoneDetailsModel(
      data.id,
      data.titles,
      data.project,
      data.prorganization_locationoject,
      data.lat,
      data.lng,
    )
  }

  // static getTitle(data: any) {
  //   const savedLocale = localStorage.getItem('lang')

  //   return new TitleInterface({
  //     id: data.id,
  //     title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
  //   })
  // }
}
