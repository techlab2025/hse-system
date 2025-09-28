import TitleInterface from '@/base/Data/Models/title_interface'

export default class SystemRiskTypeModel extends TitleInterface {
  public title: string
  public subtitle: string
  public color: string
  public alt: string
  public image: string
  public order: number
  public isActive: number

  constructor(
    id: number,
    title: string,
    subtitle: string,
    color: string,
    alt: string,
    image: string,
    order: number,
    isActive: number,
  ) {
    super({ id })
    this.title = title
    this.subtitle = subtitle
    this.color = color
    this.alt = alt
    this.image = image
    this.order = order
    this.isActive = isActive
  }

  static fromMap(data: any): SystemRiskTypeModel {
    return new SystemRiskTypeModel(
      data.id,
      data.title,
      data.subtitle,
      data.color,
      data.alt,
      data.image,
      data.order,
      data.is_active,
    )
  }
}
