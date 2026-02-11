// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import { ActionsEnum } from '../../Core/Enum/ActionType'
import TemplateItemDetailsModel from '@/features/setting/TemplateItem/Data/models/TemplateItemDetailsModel'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class TemplateDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public name: string
  public allIndustries: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]
  public templateItems: TemplateItemDetailsModel[]
  public requireImage: number
  public action: TitleInterface | null
  public title: string | null = null
  public type: number
  public tag: string

  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    name: string,
    titles: TitleLocale[] = [],
    // hasCertificate: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    templateItems: TemplateItemDetailsModel[] = [],
    requireImage: number = 0,
    action: TitleInterface | null = null,
    title: string | null = null,
    type: number,
    tag: string,
  ) {
    this.id = id
    this.name = name
    this.titles = titles
    // this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.templateItems = templateItems
    this.requireImage = requireImage
    this.action = action
    this.title = title
    this.type = type
    this.tag = tag
  }

  static fromMap(data: any): TemplateDetailsModel {
    return new TemplateDetailsModel(
      data.id,
      data.name,
      TranslationsParams.fromMap(data.titles).titles,
      // data.has_certificate,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => this.getTitle(industry))
        : [],
      data.parent_id,
      data.image,
      data.template_items?.length > 0
        ? data.template_items.map((item) => TemplateItemDetailsModel.fromMap(item))
        : [],
      data.require_image,
      this.getTemplateItemsAction(data.action),
      data.title,
      data.type,
      data.template_item_tag,
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }

  static getTemplateItemsAction(data: ActionsEnum): TitleInterface {
    switch (data) {
      case ActionsEnum.CheckBox:
        return new TitleInterface({
          id: ActionsEnum.CheckBox,
          title: 'Checkbox',
          subtitle: '',
        })
      default:
        return new TitleInterface({
          id: ActionsEnum.CheckBox,
          title: 'Unknown',
          subtitle: '',
        })
    }
  }
}
