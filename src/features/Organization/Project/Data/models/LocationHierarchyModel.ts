export default class LocationHierarchyModel {
  public locationId: number
  public locationTitle: string
  public projectLocationId: number
  public projectLocationHierarchies: number

  constructor(
    locationId: number,
    locationTitle: string,
    projectLocationId: number,
    projectLocationHierarchies: number,
  ) {
    this.locationId = locationId
    this.locationTitle = locationTitle
    this.projectLocationId = projectLocationId
    this.projectLocationHierarchies = projectLocationHierarchies
  }

  static fromMap(data: any): LocationHierarchyModel {
    return new LocationHierarchyModel(
      data.location_id,
      data.location_title,
      data.project_location_hierarchies,
      // ProjectLocationModel.fromMap(data.project_location_hierarchies),
      data.project_location_id,
    )
  }
}
