import TitleInterface from '@/base/Data/Models/title_interface'

export default class SystemComponentModel extends TitleInterface {
  public title: string
  public subtitle: string
  public isActive: number
  public order: number
  public features: TitleInterface[]

  constructor(
    id: number,
    title: string,
    subtitle:string,
    isActive: number,
    order: number,
    features: TitleInterface[],
  ) {
    super({ id })
    this.title = title
    this.subtitle = subtitle
    this.isActive = isActive
    this.order = order
    this.features = features
  }

  static fromMap(data: any): SystemComponentModel {
    return new SystemComponentModel(
      data.id,
      data.title,
      data.subtitle,
      data.is_active,
      data.order,
      data.features,
    )
  }
}
interface subTitleInterface {
  id: number
  subtitle: string
}
