export default class SystemRiskTypeDetailsModel {
  public id: number
  public titles: { locale: string; title: string }[]
  public subtitles: { locale: string; subtitle: string }[]
  public color: string
  public alt: string
  public image: string
  public order: number
  public isActive: number

  constructor(
    id: number,
    titles: { locale: string; title: string }[],
    subtitles: { locale: string; subtitle: string }[],
    color: string,
    alt: string,
    image: string,
    order: number,
    isActive: number,
  ) {
    this.id = id
    this.titles = titles
    this.subtitles = subtitles
    this.color = color
    this.alt = alt
    this.image = image
    this.order = order
    this.isActive = isActive
  }

  static fromMap(data: any): SystemRiskTypeDetailsModel {
    return new SystemRiskTypeDetailsModel(
      data.id,
      data.titles,
      data.subtitles,
      data.color,
      data.alt,
      data.image,
      data.order,
      data.is_active,
    )
  }
}
