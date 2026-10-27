import { localizedRecord } from '@/localization/records'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class EmployeeCertificateModel extends TitleInterface {
  public id: number
  public title: string

  constructor(id: number, title: string) {
    super({ id, title })
    this.id = id
    this.title = title
  }

  static fromMap(data: any): EmployeeCertificateModel {
    return localizedRecord(new EmployeeCertificateModel(data.id, data.title), data)
  }
}
