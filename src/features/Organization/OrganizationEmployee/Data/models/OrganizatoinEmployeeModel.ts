import TitleInterface from '@/base/Data/Models/title_interface'
import CertificateItemsModel from './CertificateItemsModel'
import { CertificateStatusEnum } from '../../Core/Enum/CertificateStatusEnum'

export default class OrganizatoinEmployeeModel extends TitleInterface {
  public id: number
  public name: string
  public phone: string
  public email: string
  public is_master: number
  public image: null
  public certificates: CertificateItemsModel[]
  constructor(
    id: number,
    title: string,
    name: string,
    phone: string,
    email: string,
    is_master: number,
    image: null,
    certificates: CertificateItemsModel[],
  ) {
    super({ id, title })

    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.is_master = is_master
    this.image = image
    this.certificates = certificates
  }

  static fromMap(data: any): OrganizatoinEmployeeModel {
    return new OrganizatoinEmployeeModel(
      data.id,
      data.name,
      data.name,
      data.phone,
      data.email,
      data.is_master,
      data.image,
      data.certificates,
    )
  }

  static example: OrganizatoinEmployeeModel[] = [
    new OrganizatoinEmployeeModel(1, 'Mohab', 'Mohab', '01007599123', 'mohab@gmail.com', 1, null, [
      new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid),
      new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid),
      new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired),
      new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired),
    ]),
    new OrganizatoinEmployeeModel(1, 'Mohab', 'Mohab', '01007599123', 'mohab@gmail.com', 1, null, [
      new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid),
      new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid),
      new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired),
      new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired),
    ]),
    new OrganizatoinEmployeeModel(1, 'Mohab', 'Mohab', '01007599123', 'mohab@gmail.com', 1, null, [
      new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid),
      new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid),
      new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired),
      new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired),
    ]),
  ]
}
