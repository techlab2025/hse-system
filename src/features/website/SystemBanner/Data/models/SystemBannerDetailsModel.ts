export default class SystemBannerDetailsModel {
  public id: number
  public image: string
  public isActive: number
  public order: number
  public link: string

  constructor(id: number, image: string, isActive: number, order: number, link: string) {
    this.id = id

    this.image = image
    this.isActive = isActive
    this.order = order
    this.link = link
  }

  static fromMap(data: any): SystemBannerDetailsModel {
    return new SystemBannerDetailsModel(data.id, data.image, data.is_active, data.order, data.link)
  }
}
