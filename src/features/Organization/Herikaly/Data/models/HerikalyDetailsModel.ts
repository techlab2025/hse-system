// import TitleInterface from '@/base/Data/Models/title_interface.ts'

import CertificateDetailsModel from '@/features/setting/Certificate/Data/models/CertificateDetailsModel'
import type { TitleLocale } from '@/base/core/params/translations_params'

type HerikalyParent = {
  id: number
  titles: TitleLocale[]
}

export default class HerikalyDetailsModel {
  public id: number
  public titles: string[]
  public parent_id: number
  public children: HerikalyDetailsModel[]
  public certificates: CertificateDetailsModel[]
  public parent: HerikalyParent | null

  constructor(
    id: number,
    titles: string[],
    parent_id: number,
    children: HerikalyDetailsModel[],
    certificates: CertificateDetailsModel[],
    parent: HerikalyParent | null,
  ) {
    this.id = id
    this.titles = titles
    this.parent_id = parent_id
    this.children = children
    this.certificates = certificates
    this.parent = parent
  }

  static fromMap(data: any): HerikalyDetailsModel {
    return new HerikalyDetailsModel(
      data.id,
      data.titles,
      data.parent_id,
      data.children,
      data?.certificates?.map((item: any) => CertificateDetailsModel.fromMap(item)),
      data.parent ?? null,
    )
  }

  static transformData(data: any[]): HerikalyDetailsModel[] {
    return data.map((item: any) => HerikalyDetailsModel.fromMap(item))
  }
  // static getTitle(data: any) {
  //   const savedLocale = localStorage.getItem('lang')

  //   return new TitleInterface({
  //     id: data.id,
  //     title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
  //   })
  // }
}
