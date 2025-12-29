import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import EquipmentTypeModel from './equipmentModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import type { EquipmentStatus } from '../../Core/enum/equipmentStatus'
import EquipmentTypeDetailsModel from './EquipmentTypeDetails'

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
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data?.id,
      title: data?.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
