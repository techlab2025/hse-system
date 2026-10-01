import TitleInterface from '@/base/Data/Models/title_interface'

type LocaleTitle = { locale?: string; title?: string }
type InductionProjectZoneResponse = {
  id?: number
  project_zone_id?: number
  project_zoon_id?: number
  project_location_zone_id?: number
  zone_id?: number
  zoon_id?: number
  project_location_id?: number
  project_id?: number
  title?: string
  zoon_title?: string
  zone_title?: LocaleTitle[] | string
}

export default class InductionProjectZoneModel extends TitleInterface {
  public id: number
  public projectZoneId: number
  public zoneId: number
  public projectLocationId: number
  public projectId: number
  public title: string

  constructor(
    id: number,
    projectZoneId: number,
    zoneId: number,
    projectLocationId: number,
    projectId: number,
    title: string,
  ) {
    super({ id, title })
    this.id = id
    this.projectZoneId = projectZoneId
    this.zoneId = zoneId
    this.projectLocationId = projectLocationId
    this.projectId = projectId
    this.title = title
  }

  static fromMap(data: Record<string, unknown>): InductionProjectZoneModel {
    const zone = data as InductionProjectZoneResponse
    const locale = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en'
    const projectZoneId = Number(
      zone.project_zone_id ?? zone.project_zoon_id ?? zone.project_location_zone_id ?? zone.id ?? 0,
    )
    const zoneTitle = Array.isArray(zone.zone_title)
      ? (zone.zone_title.find((item) => item.locale === locale)?.title ?? zone.zone_title[0]?.title)
      : zone.zone_title

    return new InductionProjectZoneModel(
      projectZoneId,
      projectZoneId,
      Number(zone.zone_id ?? zone.zoon_id ?? 0),
      Number(zone.project_location_id ?? 0),
      Number(zone.project_id ?? 0),
      zone.title ?? zone.zoon_title ?? zoneTitle ?? '',
    )
  }
}
