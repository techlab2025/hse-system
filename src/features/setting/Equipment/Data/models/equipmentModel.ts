import TitleModel from '@/base/core/Models/title_model'
import TitleInterface from '@/base/Data/Models/title_interface'
import EquipmentTypeDetailsModel from './EquipmentTypeDetails'
import acc from '@/assets/images/acc.png'
import EquipmentImg from '@/assets/images/EquipmentImg.jpg'
import type { EquipmentStatus } from '../../Core/enum/equipmentStatus'
import WhereHouseDetailsModel from '@/features/Organization/WhereHouse/Data/models/WhereHouseDetailsModel'

export default class EquipmentModel extends TitleInterface {
  public id: number
  public hasCertificate: number
  public allIndustries: number
  public industries: TitleModel
  public parentId: number
  public image: string
  public titles: string
  public status: EquipmentStatus
  public warehouse: WhereHouseDetailsModel

  // public equipmentType: TitleModel
  public equipmentType?: EquipmentTypeDetailsModel
  public project: TitleInterface
  public projectZoon: TitleInterface
  public certificateImage: string

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
    status: EquipmentStatus,
    equipmentType: EquipmentTypeDetailsModel,
    project: TitleInterface,
    projectZoon: TitleInterface,
    certificateImage: string,
    warehouse: WhereHouseDetailsModel,
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.status = status
    this.equipmentType = equipmentType
    this.project = project
    this.projectZoon = projectZoon
    this.certificateImage = certificateImage
    this.warehouse = warehouse
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
      data.status,
      data.equipment_type ? EquipmentTypeDetailsModel.fromMap(data.equipment_type) : null,
      // data.equipment_type_id
      data.project ? TitleModel.fromMap(data.project) : null,
      data.project_zoon ? TitleModel.fromMap(data.project_zoon) : null,
      data.certificate_image,
      data.warehouse ? WhereHouseDetailsModel.fromMap(data.warehouse) : null,
    )
  }

  static example: EquipmentModel[] = [
    new EquipmentModel(
      10,
      'Drilling Rig',
      'New Equipment Subtitle 1',
      1,
      0,
      { id: 1, title: 'New Industry 1' },
      0,
      EquipmentImg,
      [],
      1,
      new EquipmentTypeDetailsModel(
        10,
        'hand tool',
        'New Equipment Type Subtitle 1',
        1,
        0,
        [],
        0,
        EquipmentImg,
        [],
        3,
        1,
      ),
      new TitleInterface({ id: 1, title: 'Eco-friendly / Sustainability-oriented Names' }),
      new TitleInterface({ id: 1, title: 'Obour City' }),
      acc,
    ),
    new EquipmentModel(
      20,
      'Drilling Rig',
      'New Equipment Subtitle 2',
      1,
      0,
      { id: 1, title: 'New Industry 2' },
      0,
      EquipmentImg,
      [],
      2,
      new EquipmentTypeDetailsModel(
        10,
        'hand tool',
        'New Equipment Type Subtitle 1',
        1,
        0,
        [],
        0,
        EquipmentImg,
        [],
        1,
        1,
      ),
      new TitleInterface({ id: 1, title: 'Eco-friendly / Sustainability-oriented Names' }),
      new TitleInterface({ id: 1, title: 'Obour City' }),
      acc,
    ),
    new EquipmentModel(
      30,
      'Drilling Rig',
      'New Equipment Subtitle 3',
      1,
      0,
      { id: 1, title: 'New Industry 3' },
      0,
      EquipmentImg,
      [],
      1,
      new EquipmentTypeDetailsModel(
        10,
        'hand tool',
        'New Equipment Type Subtitle 1',
        1,
        0,
        [],
        0,
        EquipmentImg,
        [],
        2,
        1,
      ),
      new TitleInterface({ id: 1, title: 'Eco-friendly / Sustainability-oriented Names' }),
      new TitleInterface({ id: 1, title: 'Obour City' }),
      acc,
      new WhereHouseDetailsModel(1, 'hand tool', '102030'),
    ),
  ]
}
