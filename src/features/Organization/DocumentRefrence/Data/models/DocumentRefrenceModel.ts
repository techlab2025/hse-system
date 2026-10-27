import { localizedRecord } from '@/localization/records'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class DocumentRefrenceModel extends TitleInterface {
  public id: number
  public title: string

  constructor(id: number, title: string) {
    super({ id, title })
    this.id = id
    this.title = title
  }

  static fromMap(data: any): DocumentRefrenceModel {
    return localizedRecord(new DocumentRefrenceModel(data.id, data.title), data)
  }

  static transformData(data: string[][]): DocumentRefrenceModel[] {
    return data.map((row, index) => new DocumentRefrenceModel(index + 1, row[0] || ''))
  }
}
