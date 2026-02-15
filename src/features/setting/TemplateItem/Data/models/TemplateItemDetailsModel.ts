import type { TitleLocale } from '@/base/core/params/translations_params'
import ItemModel from './ItemMode'

export default class TemplateItemDetailsModel {
  public id: number
  public name: string
  public all_industries: number
  public industries: []
  public action: number
  public requiredImage: boolean
  public options: ItemModel[]
  public has_textarea: number = 0
  public tag: TitleLocale[]
  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    name: string,
    all_industries: number,
    industries: [],
    action: number,
    requiredImage: boolean,
    options: ItemModel[] = [],
    has_textarea: number = 0,
    tag: TitleLocale[],
  ) {
    this.id = id
    this.name = name
    this.all_industries = all_industries
    this.industries = industries
    this.action = action
    this.requiredImage = requiredImage
    this.options = options
    this.has_textarea = has_textarea
    this.tag = tag
  }

  static fromMap(data: any): TemplateItemDetailsModel {
    return new TemplateItemDetailsModel(
      data.id,
      data.name,
      data.all_industries ?? 0,
      data.industries ?? [],
      data.action ?? 0,
      data.require_image,
      data.options.length > 0 ? data.options.map((item) => ItemModel.fromMap(item)) : [],
      data.has_textarea,
      data.template_item_tag,
    )
  }
}
