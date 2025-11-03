// import TitleInterface from '@/base/Data/Models/title_interface.ts'

import TitleInterface from '@/base/Data/Models/title_interface'
import type OrganizationLocationModel from '@/features/Organization/OrganizationLocation/Data/models/OrganizationLocationModel'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'

export default class ProjectZoneDetailsModel {
  public id: number
  public titles: string[]
  public project: ProjectModel
  public location: OrganizationLocationModel
  public lat: string
  public lng: string

  constructor(
    id: number,
    titles: string[],
    project: ProjectModel,
    location: OrganizationLocationModel,
    lat: string,
    lng: string,
  ) {
    this.id = id
    this.titles = titles
    this.project = project
    this.location = location
    this.lat = lat
    this.lng = lng
  }

  static fromMap(data: any): ProjectZoneDetailsModel {
    return new ProjectZoneDetailsModel(
      data.id,
      data.titles,
      data?.project ? this.getTitle(data.project) : null,
      data?.location ? this.getTitle(data.location) : null,
      data.lat,
      data.lng,
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    if (!data.id) return null
    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
