import type TitleInterface from '@/base/Data/Models/title_interface'
import ProjectLocationEquipmentModel from './CustomLocation/ProjectLocationEquipmentModel'
import TitleModel from '@/base/core/Models/title_model'
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params'
import projectLocationZoonsModel from './projectLocationZoons'

export default class SohwProjectZoonModel {
  public projectZoonId: number
  public zoonId: number
  public zoonTitle: string
  public projectZoonEquipments: ProjectLocationEquipmentModel[]
  public location: TitleInterface
  public projectLocationId: number
  public projectLocationZoons?: projectLocationZoonsModel[]
  public titles: TitleLocale[]

  constructor(
    projectZoonId: number,
    zoonId: number,
    zoonTitle: string,
    projectZoonEquipments: ProjectLocationEquipmentModel[],
    location: TitleInterface,
    projectLocationId: number,
    projectLocationZoons: projectLocationZoonsModel[] = [],
    titles: TitleLocale[] = [],
  ) {
    this.projectZoonId = projectZoonId
    this.zoonId = zoonId
    this.zoonTitle = zoonTitle
    this.projectZoonEquipments = projectZoonEquipments
    this.location = location
    this.projectLocationId = projectLocationId
    this.projectLocationZoons = projectLocationZoons
    this.titles = titles
  }

  static fromMap(data: any): SohwProjectZoonModel {
    return new SohwProjectZoonModel(
      data.project_zoon_id,
      data.zoon_id || data.id,
      data.zoon_title || data.title,
      data.project_zoon_equipments?.map((item: any) => ProjectLocationEquipmentModel.fromMap(item)),
      data.location,
      data.projectLocationId,
      data.project_location_zoons?.map((z: any) => projectLocationZoonsModel.fromMap(z)),
      TranslationsParams.fromMap(data.zoon_titles).titles,
    )
  }
}
