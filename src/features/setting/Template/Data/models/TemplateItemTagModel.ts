import type { TitleLocale } from '@/base/core/params/translations_params'
import TranslationsParams from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'
import TemplateItemDetailsModel from '@/features/setting/TemplateItem/Data/models/TemplateItemDetailsModel'

export default class TemplateItemTagModel {
  public id: number
  public templateItemTagId: number
  public titles: TitleLocale[]
  public templateItems: TemplateItemDetailsModel[]
  public title: string

  constructor(
    id: number,
    templateItemTagId: number,
    titles: TitleLocale[],
    templateItems: TemplateItemDetailsModel[] = [],
    title: string,
  ) {
    this.id = id
    this.templateItemTagId = templateItemTagId
    this.titles = titles
    this.templateItems = templateItems
    this.title = title
  }

  static fromMap(data: any): TemplateItemTagModel {
    return new TemplateItemTagModel(
      data.id,
      data.template_item_tag_id,
      TranslationsParams.fromMap(data.titles).titles,
      data.template_items?.length > 0
        ? data.template_items.map((item) => TemplateItemDetailsModel.fromMap(item))
        : [],
      data.title,
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
