import { localizedRecord } from '@/localization/records'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class PpeItemModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): PpeItemModel {
    return localizedRecord(new PpeItemModel(data.id, data.title), data)
  }

  static example: PpeItemModel[] = [
    new PpeItemModel(1, 'Safety helmet'),
    new PpeItemModel(2, 'Safety gloves'),
  ]

  static transformData(data: string[][]): PpeItemModel[] {
    return data.map((row, index) => new PpeItemModel(index + 1, row[0] || ''))
  }
}
