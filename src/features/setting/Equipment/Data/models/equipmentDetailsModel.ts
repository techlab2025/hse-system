import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import EquipmentTypeModel from './equipmentModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import { EquipmentStatus } from '../../Core/enum/equipmentStatus'
import EquipmentTypeDetailsModel from './EquipmentTypeDetails'
import ContractorDetailsModel from '@/features/setting/contractor/Data/models/ContractorDetailsModel'
import WhereHouseDetailsModel from '@/features/Organization/WhereHouse/Data/models/WhereHouseDetailsModel'
import acc from '@/assets/images/acc.png'
import TaskResultModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/TasksResultModel'
import InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'
import TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import TemplateItemModel from '@/features/setting/TemplateItem/Data/models/TemplateItemModel'

export default class EquipmentDetailsModel {
  public id: number
  public allIndustries: number
  public certificateImage: string
  public date: string
  public inspectionDuration: string
  public licenseNumber: string
  public licensePlateNumber: string
  public status: EquipmentStatus
  public titles: TitleLocale[]
  public hasCertificate: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]
  public equipmentTypeId: number
  public equipment_type: EquipmentTypeDetailsModel
  public kilometer: string
  public checkinDate: string
  public RentType: string
  public RentTime: string
  public wareHouse: number
  public contractor: ContractorDetailsModel
  public warehouse: WhereHouseDetailsModel
  public lastInspectoinDate: string
  public tasks_without_result: InspectionModel[]
  public tasks_with_result: InspectionModel[]

  constructor(
    id: number,
    allIndustries: number,
    certificateImage: string,
    date: string,
    inspectionDuration: string,
    licenseNumber: string,
    licensePlateNumber: string,
    status: EquipmentStatus,
    titles: TitleLocale[],
    hasCertificate: number,
    parentId: number,
    image: string,
    industries: TitleModel<string>[],
    equipmentTypeId: number,
    equipment_type: EquipmentTypeDetailsModel,
    kilometer: string,
    checkinDate: string,
    RentType: string,
    RentTime: string,
    wareHouse: number,
    contractor: ContractorDetailsModel,
    warehouse: WhereHouseDetailsModel,
    lastInspectoinDate: string,
    tasks_without_result: InspectionModel[],
    tasks_with_result: InspectionModel[],
  ) {
    this.id = id
    this.allIndustries = allIndustries
    this.certificateImage = certificateImage
    this.date = date
    this.inspectionDuration = inspectionDuration
    this.licenseNumber = licenseNumber
    this.licensePlateNumber = licensePlateNumber
    this.status = status
    this.titles = titles
    this.hasCertificate = hasCertificate
    this.parentId = parentId
    this.image = image
    this.industries = industries
    this.equipmentTypeId = equipmentTypeId
    this.equipment_type = equipment_type
    this.kilometer = kilometer
    this.checkinDate = checkinDate
    this.RentType = RentType
    this.RentTime = RentTime
    this.wareHouse = wareHouse
    this.contractor = contractor
    this.warehouse = warehouse
    this.lastInspectoinDate = lastInspectoinDate
    this.tasks_without_result = tasks_without_result
    this.tasks_with_result = tasks_with_result

    // this.type = type
  }

  static fromMap(data: any): EquipmentDetailsModel {
    return new EquipmentDetailsModel(
      data.id,
      data.all_industries,
      data.certificate_image,
      data.date,
      data.inspection_duration,
      data.license_number,
      data.license_plate_number,
      // this.getStatus(data.status),
      data.status,
      TranslationsParams.fromMap(data.titles).titles,
      data.has_certificate,
      0,
      data.image,
      data.industries.length > 0 ? data.industries.map((industry) => this.getTitle(industry)) : [],
      data.equipment_type_id,
      data.equipment_type ? EquipmentTypeDetailsModel?.fromMap(data.equipment_type) : null,
      data.kilometer,
      data.checkin_date,
      data.period_type,
      data.period,
      data.wareHouse,
      data.contractor ? ContractorDetailsModel?.fromMap(data.contractor) : null,
      data.warehouse ? WhereHouseDetailsModel?.fromMap(data.warehouse) : null,
      data.last_inspection_date,
      data?.tasks_without_result?.length > 0
        ? data.tasks_without_result.map((task) => InspectionModel?.fromMap(task))
        : [],
      data?.tasks_with_result?.length > 0
        ? data.tasks_with_result.map((task) => InspectionModel?.fromMap(task))
        : [],
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data?.id,
      title: data?.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
  static example: EquipmentDetailsModel = new EquipmentDetailsModel(
    1,
    1,
    acc,
    '10-20-2001',
    '20',
    '20',
    '20',
    EquipmentStatus.RENT,
    [{ locale: 'en', title: 'text' }],
    1,
    '',
    acc,
    [],
    12,
    new EquipmentTypeDetailsModel(
      10,
      'new Equipment Type',
      'Subtitle ',
      1,
      1,
      null,
      10,
      acc,
      [{ title: 'text', locale: 'en' }],
      1,
      20,
    ),
    '12000',
    '1-9-2201',
    '1',
    '2',
    10,
    12,
    new WhereHouseDetailsModel(1, 'warehouse test', '10'),
    '20-2-2000',
    [
      new InspectionModel(
        1,
        new TemplateDetailsModel(
          1,
          'Test',
          [{ title: 'test', locale: 'en' }],
          1,
          null,
          10,
          acc,
          [
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
          ],
          1,
          null,
          10,
          acc,
          'new',
          null,
        ),
        '55-9-2000',

        null,
        10,
        acc,
        'new',
        null,
      ),
      new InspectionModel(
        1,
        new TemplateDetailsModel(
          1,
          'Test',
          [{ title: 'test', locale: 'en' }],
          1,
          null,
          10,
          acc,
          [
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
          ],
          1,
          null,
          10,
          acc,
          'new',
          null,
        ),
        '1-9-2001',
        null,
        10,
        acc,
        'new',
        null,
      ),
      new InspectionModel(
        1,
        new TemplateDetailsModel(
          1,
          'Test',
          [{ title: 'test', locale: 'en' }],
          1,
          null,
          10,
          acc,
          [
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
            new TemplateItemModel(10, 'new ', 'subtitle', 1, 1, null, 10, acc, 'new', null),
          ],
          1,
          null,
          10,
          acc,
          'new',
          null,
        ),
        '2-9-2001',
        null,
        10,
        acc,
        'new',
        null,
      ),
    ],
  )
}
