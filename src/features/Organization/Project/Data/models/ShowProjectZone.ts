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
  public zoons: TitleModel[]
  public projectId: number

  constructor(
    projectZoonId: number,
    zoonId: number,
    zoonTitle: string,
    projectZoonEquipments: ProjectLocationEquipmentModel[],
    location: TitleInterface,
    projectLocationId: number,
    projectLocationZoons: projectLocationZoonsModel[] = [],
    titles: TitleLocale[] = [],
    zoons: TitleModel[] = [],
    projectId: number,
  ) {
    this.projectZoonId = projectZoonId
    this.zoonId = zoonId
    this.zoonTitle = zoonTitle
    this.projectZoonEquipments = projectZoonEquipments
    this.location = location
    this.projectLocationId = projectLocationId
    this.projectLocationZoons = projectLocationZoons
    this.titles = titles
    this.zoons = zoons
    this.projectId = projectId
  }

  static fromMap(data: any): SohwProjectZoonModel {
    return new SohwProjectZoonModel(
      data.project_zoon_id,
      data.zoon_id || data.id,
      data.zoon_title || data.title,
      data.project_zoon_equipments?.map(
        (item: any) => ProjectLocationEquipmentModel?.fromMap(item),
        // ProjectLocationEquipmentModel?.example,
      ),
      data.location,
      data.projectLocationId,
      data.project_location_zoons?.map((z: any) => projectLocationZoonsModel?.fromMap(z)),
      TranslationsParams.fromMap(data.zoon_titles).titles,
      data.zoons?.map((z: any) => TitleModel.fromMap(z)),
      data.project_id,
    )
  }

  static example: SohwProjectZoonModel = new SohwProjectZoonModel(
    1,
    10,
    'zoon',
    [],
    { id: 1, title: 'location' },
    1,
    [],
    [],
    [],
    1,
  )
}
