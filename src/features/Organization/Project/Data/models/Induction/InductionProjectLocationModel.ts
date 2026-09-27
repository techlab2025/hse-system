import TitleInterface from '@/base/Data/Models/title_interface'

type LocaleTitle = { locale?: string; title?: string }
type InductionProjectLocationResponse = {
  id?: number
  project_location_id?: number
  project_id?: number
  location_id?: number
  title?: string
  location_title?: string
  location_titles?: LocaleTitle[]
}

export default class InductionProjectLocationModel extends TitleInterface {
  public id: number
  public projectLocationId: number
  public projectId: number
  public locationId: number
  public title: string

  constructor(id: number, projectLocationId: number, projectId: number, locationId: number, title: string) {
    super({ id, title })
    this.id = id
    this.projectLocationId = projectLocationId
    this.projectId = projectId
    this.locationId = locationId
    this.title = title
  }

  static fromMap(data: Record<string, unknown>): InductionProjectLocationModel {
    const location = data as InductionProjectLocationResponse
    const locale = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en'
    const projectLocationId = Number(location.project_location_id ?? location.id ?? 0)

    return new InductionProjectLocationModel(
      projectLocationId,
      projectLocationId,
      Number(location.project_id ?? 0),
      Number(location.location_id ?? 0),
      location.title ??
        location.location_title ??
        location.location_titles?.find((item) => item.locale === locale)?.title ??
        location.location_titles?.[0]?.title ??
        '',
    )
  }
}
