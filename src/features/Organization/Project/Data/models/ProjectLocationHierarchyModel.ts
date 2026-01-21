import TitleInterface from '@/base/Data/Models/title_interface'

export default class ProjectLocationHierarchyModel extends TitleInterface {
  public locationId: number
  public projectLocationId: number

  constructor(id: number, title: string, locationId: number, projectLocationId: number) {
    super({ id: id, title: title })
    this.locationId = locationId
    this.projectLocationId = projectLocationId
  }

  static fromMap(data: any): ProjectLocationHierarchyModel {
    return new ProjectLocationHierarchyModel(
      data.project_location_hierarchies,
      data.location_title,
      data.location_id,
      data.project_location_id,
    )
  }
}
