import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'

export default class ServiceModel extends TitleInterface {
  public id: number
  public title: string
  public subtitle: string
  public description: string
  public alt: string
  public image: string
  public isActive: number
  public order: number
  public includes: TitleModel[]
  public createdAt?: string

  constructor(
    id: number,
    title: string,
    subtitle: string,
    description: string,
    alt: string,
    image: string,
    isActive: number,
    order: number,
    includes: TitleModel[],
    createdAt?: string,
  ) {
    super({ id })
    this.id = id
    this.title = title
    this.subtitle = subtitle
    this.description = description
    this.alt = alt
    this.image = image
    this.isActive = isActive
    this.order = order
    this.includes = includes
    this.createdAt = createdAt
  }

  static fromMap(data: any): ServiceModel {
    return new ServiceModel(
      data.id,
      data.title,
      data.subtitle, // fixed key
      data.description,
      data.alt,
      data.image,
      data.is_active,
      data.order,
      data.includes?.map((i: any) => TitleModel.fromMap(i)) ?? [],
      data.created_at,
    )
  }
}
