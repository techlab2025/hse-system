import TitleInterface from '@/base/Data/Models/title_interface'

export default class ProjectScopeLocationModel extends TitleInterface {
  constructor(
    public projectLocationId: number,
    public projectId: number,
    public locationId: number,
    public locationTitle: string,
  ) {
    super({ id: projectLocationId, title: locationTitle })
  }

  static fromMap(data: Record<string, unknown>): ProjectScopeLocationModel {
    const projectLocationId = Number(data.project_location_id ?? data.id ?? 0)
    const locationTitle = String(data.location_title ?? data.title ?? '')

    return new ProjectScopeLocationModel(
      projectLocationId,
      Number(data.project_id ?? 0),
      Number(data.location_id ?? 0),
      locationTitle,
    )
  }
}
