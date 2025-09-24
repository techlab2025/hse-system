// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import { ActionsEnum } from '../../Core/Enum/ActionType'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class TemplateDetailsModel {
  public id: number
  public titles: TitleLocale[]
  // public hasCertificate: number
  public allIndustries: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]
  public templateItems: TemplateDetailsModel[]
  public requireImage: number
  public action: TitleInterface | null
  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],
    // hasCertificate: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    templateItems: TemplateDetailsModel[] = [],
    requireImage: number = 0,
    action: TitleInterface | null = null


  ) {
    this.id = id
    this.titles = titles
    // this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.templateItems = templateItems
    this.requireImage = requireImage
    this.action = action

  }

  static fromMap(data: any): TemplateDetailsModel {
    return new TemplateDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      // data.has_certificate,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => this.getTitle(industry))
        : [],
      data.parent_id,
      data.image,
      data.template_items?.length > 0
        ? data.template_items?.map((item) => this.fromMap(item))
        : [],
      data.require_image,
      this.getTemplateItemsAction(data.action),

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
