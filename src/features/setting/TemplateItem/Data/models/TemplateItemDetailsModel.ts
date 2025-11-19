import type ItemModel from './ItemMode'

export default class TemplateItemDetailsModel {
  public id: number
  public name: string
  public all_industries: number
  public industries: []
  public action: number
  public requiredImage: boolean
  public options: ItemModel[]

  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    name: string,
    all_industries: number,
    industries: [],
    action: number,
    requiredImage: boolean,
    options: ItemModel[] = [],
  ) {
    this.id = id
    this.name = name
    this.all_industries = all_industries
    this.industries = industries
    this.action = action
    this.requiredImage = requiredImage
    this.options = options
  }

  static fromMap(data: any): TemplateItemDetailsModel {
    return new TemplateItemDetailsModel(
      data.id,
      data.name,
      data.all_industries ?? 0,
      data.industries ?? [],
      data.action ?? 0,
      data.require_image,
      data.options,
    )
  }
}
