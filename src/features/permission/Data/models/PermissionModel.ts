import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
import type LocationModel from '@/features/setting/Location/Data/models/LocationModel'
// import ClientPermissionModel from "@/features/dashboard/settings/clientPermission/Data/models/index_client_Permission_model";

export default class PermissionModel extends TitleInterface {
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

  static fromMap(data: any): PermissionModel {
    return new PermissionModel(
      data.id,
      data.title,
      data.lat,
      data.lng,
      data.location

    )
  }
}
