import TitleInterface from '@/base/Data/Models/title_interface'

export default class ProjectScopeZoneModel extends TitleInterface {
  constructor(
    public projectZoonId: number,
    public projectLocationId: number,
    public projectId: number,
    public zoonId: number,
    public zoonTitle: string,
  ) {
    super({ id: projectZoonId, title: zoonTitle })
  }

  static fromMap(data: Record<string, unknown>): ProjectScopeZoneModel {
    const projectZoonId = Number(
      data.project_zoon_id ?? data.project_zone_id ?? data.project_location_zone_id ?? data.id ?? 0,
    )
    const zoonTitle = String(data.zoon_title ?? data.zone_title ?? data.title ?? '')

    return new ProjectScopeZoneModel(
      projectZoonId,
      Number(data.project_location_id ?? 0),
      Number(data.project_id ?? 0),
      Number(data.zoon_id ?? data.zone_id ?? 0),
      zoonTitle,
    )
  }
}
