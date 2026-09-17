// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import type EmployeeTypeModel from './equipmentModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import type { EquipmentCondition } from '@/features/setting/Equipment/Core/enum/equipmentConditionEnum'
import type { EquipmentUsed } from '@/features/setting/Equipment/Core/enum/EquipemntUsedENum'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class EmployeeDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public hasCertificate: number
  public allIndustries: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]
  public equipmentTypeId: EmployeeTypeModel
  public equipmentCondition: EquipmentCondition | null
  public equipmentUsedStatus: EquipmentUsed | null

  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],
    hasCertificate: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    equipmentTypeId: EmployeeTypeModel,
    equipmentCondition: EquipmentCondition | null,
    equipmentUsedStatus: EquipmentUsed | null,
  ) {
    this.id = id
    this.titles = titles
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.equipmentTypeId = equipmentTypeId
    this.equipmentCondition = equipmentCondition
    this.equipmentUsedStatus = equipmentUsedStatus
  }

  static fromMap(data: any): EmployeeDetailsModel {
    return new EmployeeDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      data.has_certificate,
      data.all_industries,
      data.industries.length > 0 ? data.industries.map((industry) => this.getTitle(industry)) : [],
      data.parent_id,
      data.image,
      this.getTitle(data.equipment_type_id),
      data.equipment_condition ?? data.equipment_conditions ?? null,
      data.eqipent_used_status ?? null,
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
