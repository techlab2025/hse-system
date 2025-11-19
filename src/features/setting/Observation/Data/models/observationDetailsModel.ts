// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class ObservationDetailsModel {
  public id: number
  public title: string
  public date: string
  public equipment: TitleInterface
  public image: string
  public save_status: number
  public risk_level: number
  public is_near_miss: number
  public is_action: boolean
  public is_result: boolean
  public action: string

  constructor(id: number, title: string, date: string, equipment: TitleInterface, image: string, save_status: number, risk_level: number, is_near_miss: number, is_action: boolean,
    is_result: boolean, action: string = ''

  ) {
    this.id = id
    this.title = title
    this.date = date
    this.equipment = equipment
    this.image = image
    this.save_status = save_status
    this.risk_level = risk_level
    this.is_near_miss = is_near_miss
    this.is_action = is_action
    this.is_result = is_result
    this.action = action

  }

  static fromMap(data: any): ObservationDetailsModel {

    const currentLocale = localStorage.getItem("locale") || "en"
    const title = typeof data.title === "object" ? data.title[currentLocale] : data.title

    return new ObservationDetailsModel(
      data.id,
      title,
      data.date,
      this.getTitle(data.equipment),
      data.image,
      data.save_status,
      data.risk_level,
      data.is_near_miss,
      data.is_action,
      data.is_result,
      data.action

    )
  }
  static getTitle(data: any): TitleInterface {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}

