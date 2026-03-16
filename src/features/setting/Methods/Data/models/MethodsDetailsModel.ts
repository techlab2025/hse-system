import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class MethodsDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public allIndustries: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]

  constructor(
    id: number,
    titles: TitleLocale[],
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
  ) {
    this.id = id
    this.titles = titles
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
  }

  static fromMap(data: any): MethodsDetailsModel {
    return new MethodsDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => this.getTitle(industry))
        : [],
      data.parent_id,
      data.image,
    )
  }
  static example: MethodsDetailsModel = new MethodsDetailsModel(
    1,
    [
      {
        locale: 'en',
        title: 'Method 1',
      },
      {
        locale: 'ar',
        title: 'الطريقة 1',
      },
    ],
    1,
    [new TitleModel<string>(1, 'Industry 1', 'en')],
    0,
    '',
  )

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
