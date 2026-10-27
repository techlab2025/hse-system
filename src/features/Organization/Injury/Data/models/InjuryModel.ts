import { localizedRecord } from '@/localization/records'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class InjuryModel extends TitleInterface {
  public id: number
  public title: string

  constructor(id: number, title: string) {
    super({ id, title })
    this.id = id
    this.title = title
  }

  static fromMap(data: any): InjuryModel {
    return localizedRecord(new InjuryModel(data.id, data.title), data)
  }

  static transformData(data: string[][]): InjuryModel[] {
    return data.map((row, index) => new InjuryModel(index + 1, row[0] || ''))
  }
}
