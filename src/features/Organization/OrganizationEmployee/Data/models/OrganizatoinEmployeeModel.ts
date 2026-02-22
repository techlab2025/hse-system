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
  public hierarchy: TitleInterface[]
  public employee_certificates: CertificateItemsModel[]

  constructor(
    id: number,
    title: string,
    name: string,
    phone: string,
    email: string,
    is_master: number,
    image: null,
    certificates: CertificateItemsModel[],
    hierarchy: TitleInterface[],
    employee_certificates: CertificateItemsModel[],
  ) {
    super({ id, title })

    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.is_master = is_master
    this.image = image
    this.certificates = certificates
    this.hierarchy = hierarchy
    this.employee_certificates = employee_certificates
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
      data.hierarchy,
      data.employee_certificates,
    )
  }

  static example: OrganizatoinEmployeeModel[] = [
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
    new OrganizatoinEmployeeModel(
      1,
      'Mohab',
      'Mohab',
      '01007599123',
      'mohab@gmail.com',
      1,
      null,
      [
        new CertificateItemsModel(157, 'cer1', CertificateStatusEnum.Invalid, '10-20-30'),
        new CertificateItemsModel(156, 'cer2', CertificateStatusEnum.Valid, '10-20-30'),
        new CertificateItemsModel(155, 'cer3', CertificateStatusEnum.Expired, '10-20-30'),
        new CertificateItemsModel(139, 'cer4', CertificateStatusEnum.NotRequired, '10-20-30'),
      ],
      [new TitleInterface({ id: 1, title: 'SEO' })],
    ),
  ]

   static transformData(data: string[][]): OrganizatoinEmployeeModel[] {
    return data.map(
      (row, index) =>
        new OrganizatoinEmployeeModel(
          index + 1, // Generate unique ID (or use 0 if not needed)
          row[0] || "", // Employee Name
          row[1] || "", // Employee Code
          row[2] || "", // Employee Phone
          row[3] || "", // Employee Email
          row[4] || 0, // Employee Is Master
          row[5] || "", // Employee Image
          row[6] || [], // Employee Certificates
          row[7] || [], // Employee Hierarchy
          row[8] || [], // Employee Employee Certificates
        ),
    );
  }
}
