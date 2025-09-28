import TitleInterface from '@/base/Data/Models/title_interface'

export default class SystemFeatureModel extends TitleInterface {
  public id: number
  public feature: string
  public old: string
  public New: string
  public order: number
  public isActive: number

  constructor(
    id: number,
    feature: string,
    old: string,
    New: string,
    order: number,
    isActive: number,
  ) {
    super({ id })
    this.id = id

    this.feature = feature
    this.old = old
    this.New = New
    this.order = order
    this.isActive = isActive
  }

  static fromMap(data: any): SystemFeatureModel {
    return new SystemFeatureModel(
      data.id,
      data.feature,
      data.old,
      data.new,
      data.order,
      data.is_active,
    )
  }
}
