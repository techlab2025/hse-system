export default class OvservationEquipmentModel {
  public id: number
  public title: string
  public description: string
  public all_industries: number
  public equipmentTypeId: any
  public industries: []
  public image: string
  public certificateImage: string
  public date: string
  public status: number
  public inspectionDuration: number
  public licenseNumber: number
  public licensePlateNumber: number

  constructor(
    id: number,
    title: string,
    description: string,
    all_industries: number,
    equipmentTypeId: any,
    industries: [],
    image: string,
    certificateImage: string,
    date: string,
    status: number,
    inspectionDuration: number,
    licenseNumber: number,
    licensePlateNumber: number,
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.all_industries = all_industries
    this.equipmentTypeId = equipmentTypeId
    this.industries = industries
    this.image = image
    this.certificateImage = certificateImage
    this.date = date
    this.status = status
    this.inspectionDuration = inspectionDuration
    this.licenseNumber = licenseNumber
    this.licensePlateNumber = licensePlateNumber
  }

  static fromMap(data: any): OvservationEquipmentModel {
    return new OvservationEquipmentModel(
      data.id,
      data.title,
      data.description,
      data.all_industries,
      data.equipmentTypeId,
      data.industries,
      data.image,
      data.certificate_image,
      data.date,
      data.status,
      data.inspection_duration,
      data.license_number,
      data.license_plate_number,
    )
  }
}
