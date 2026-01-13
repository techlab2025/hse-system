import { CertificateStatusEnum } from '../../Core/Enum/CertificateStatusEnum'

export default class CertificateItemsModel {
  public id: number
  public title: string
  public status: CertificateStatusEnum
  public expiry_date: string

  constructor(id: number, title: string, status: CertificateStatusEnum, expiry_date: string) {
    this.id = id
    this.title = title
    this.status = status
    this.expiry_date = expiry_date
  }

  static fromMap(data: any): CertificateItemsModel {
    return new CertificateItemsModel(data.id, data.title, data.status, data.expired_at)
  }

  static example: CertificateItemsModel = new CertificateItemsModel(
    1,
    'Mohab',
    CertificateStatusEnum.Invalid,
    '10-20-30',
  )
}
