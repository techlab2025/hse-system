import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import LocationModel from '@/features/setting/Location/Data/models/LocationModel'

export default class PermissionDetailsModel {
  public id: number
  public type: OrganizationTypeEnum
  public type_id: number
  public permission: string[]

  constructor(
    id: number,
    type: OrganizationTypeEnum,
    type_id: number,
    permission: string[],
  ) {
    this.id = id
    this.type = type
    this.type_id = type_id
    this.permission = permission
  }

  static getLocale(): string {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en'
  }

  static fromMap(data: any): PermissionDetailsModel {
    return new PermissionDetailsModel(
      data.id,
      data.type,
      data.type_id,
      data.permissions || [],
    )
  }

  static getTitle(data: any) {
    const locale = this.getLocale()
    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((t: any) => t.locale === locale)?.title,
      // subtitle: data.code,
    })
  }


}
