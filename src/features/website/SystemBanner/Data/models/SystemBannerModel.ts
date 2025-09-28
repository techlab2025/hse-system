import TitleInterface from '@/base/Data/Models/title_interface'

export default class SystemBannerModel extends TitleInterface {
  public id: number
  public image: string
  public isActive: number
  public order: number
  public link: string

  constructor(id: number, image: string, isActive: number, order: number, link: string) {
    super({ id })
    this.id = id

    this.image = image
    this.isActive = isActive
    this.order = order
    this.link = link
  }

  static fromMap(data: any): SystemBannerModel {
    return new SystemBannerModel(data.id, data.image, data.is_active, data.order, data.link)
  }
}
