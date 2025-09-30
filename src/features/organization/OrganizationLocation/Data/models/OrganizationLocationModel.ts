import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
import type LocationModel from '@/features/setting/Location/Data/models/LocationModel'
// import ClientOrganizationLocationModel from "@/features/dashboard/settings/clientOrganizationLocation/Data/models/index_client_OrganizationLocation_model";

export default class OrganizationLocationModel extends TitleInterface {
  public id: number
  public title: string
  public lat: string
  public lng: string
  public location: LocationModel

  constructor(
    id: number,
    title: string,
    lat: string,
    lng: string,
    location: LocationModel


  ) {
    super({ id, title })
    this.id = id
    this.title = title

    this.lat = lat
    this.lng = lng
    this.location = location
  }

  static fromMap(data: any): OrganizationLocationModel {
    return new OrganizationLocationModel(
      data.id,
      data.title,
      data.lat,
      data.lng,
      data.location

    )
  }
}
