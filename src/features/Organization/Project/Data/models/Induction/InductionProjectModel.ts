import TitleInterface from '@/base/Data/Models/title_interface'

type LocaleTitle = { locale?: string; title?: string }
type InductionProjectResponse = {
  id?: number
  project_id?: number
  title?: string
  titles?: LocaleTitle[]
  serial_number?: string
  serial_name?: string
}

export default class InductionProjectModel extends TitleInterface {
  public id: number
  public projectId: number
  public title: string
  public serialNumber: string
  public serialName: string

  constructor(id: number, projectId: number, title: string, serialNumber: string, serialName: string) {
    super({ id, title, subtitle: serialName || serialNumber })
    this.id = id
    this.projectId = projectId
    this.title = title
    this.serialNumber = serialNumber
    this.serialName = serialName
  }

  static fromMap(data: Record<string, unknown>): InductionProjectModel {
    const project = data as InductionProjectResponse
    const locale = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en'

    return new InductionProjectModel(
      Number(project.project_id ?? project.id ?? 0),
      Number(project.project_id ?? project.id ?? 0),
      project.title ??
        project.titles?.find((item) => item.locale === locale)?.title ??
        project.titles?.[0]?.title ??
        project.serial_name ??
        '',
      project.serial_number ?? '',
      project.serial_name ?? '',
    )
  }
}
