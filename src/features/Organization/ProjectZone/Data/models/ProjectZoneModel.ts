import TitleInterface from '@/base/Data/Models/title_interface'
// import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class ProjectZoneModel extends TitleInterface {
  public title: string
  public project: {}
  public prorganization_locationoject: {}
  public lat: string
  public lng: string

  constructor(
    id: number,
    title: string,
    project: {},
    prorganization_locationoject: {},
    lat: string,
    lng: string,
  ) {
    super({ id })
    this.title = title
    this.project = project
    this.prorganization_locationoject = prorganization_locationoject
    this.lat = lat
    this.lng = lng
  }

  static fromMap(data: any): ProjectZoneModel {
    return new ProjectZoneModel(
      data.id,
      data.title,
      data.project,
      data.prorganization_locationoject,
      data.lat,
      data.lng,
    )
  }
}
