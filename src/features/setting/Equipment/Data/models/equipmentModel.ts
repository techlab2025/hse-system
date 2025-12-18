import TitleModel from '@/base/core/Models/title_model'
import TitleInterface from '@/base/Data/Models/title_interface'
import EquipmentTypeDetailsModel from './EquipmentTypeDetails'

export default class EquipmentModel extends TitleInterface {
  public id: number
  public hasCertificate: number
  public allIndustries: number
  public industries: TitleModel
  public parentId: number
  public image: string
  public titles: string
  // public equipmentType: TitleModel
  public equipmentType?: EquipmentTypeDetailsModel

  constructor(
    id: number,
    title: string,
    subtitle: string,
    hasCertificate: number,
    allIndustries: number,
    industries: TitleModel,
    parentId: number,
    image: string,
    titles: string,
    equipmentType: EquipmentTypeDetailsModel,
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.equipmentType = equipmentType
  }

  static fromMap(data: any): EquipmentModel {
    return new EquipmentModel(
      data?.id,
      data.title,
      data.subtitle,
      data.has_certificate,
      data.all_industries,
      data.industries.length > 0
        ? data.industries.map((industry) => TitleModel.fromMap(industry))
        : [],
      data.parent_id,
      data.image,
      data.titles,
      data.equipment_type,
      // data.equipment_type_id
    )
  }
}
