export default class SystemFeatureDetailsModel {
  public id: number
  public features: { locale: string; feature: string }[]
  public olds: { locale: string; old: string }[]
  public news: { locale: string; new: string }[]
  public order: number
  public isActive: number

  constructor(
    id: number,
    features: { locale: string; feature: string }[],
    olds: { locale: string; old: string }[],
    news: { locale: string; new: string }[],
    order: number,
    isActive: number,
  ) {
    this.id = id
    this.features = features
    this.olds = olds
    this.news = news
    this.order = order
    this.isActive = isActive
  }

  static fromMap(data: any): SystemFeatureDetailsModel {
    return new SystemFeatureDetailsModel(
      data.id,
      data.features,
      data.olds,
      data.news,
      data.order,
      data.is_active,
    )
  }
}
