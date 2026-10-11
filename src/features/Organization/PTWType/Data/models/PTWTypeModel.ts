import TitleInterface from '@/base/Data/Models/title_interface'

export default class PTWTypeModel extends TitleInterface {
  constructor(id: number, title: string, color?: string) {
    super({ id, title, color })
  }

  static fromMap(data: any): PTWTypeModel {
    return new PTWTypeModel(data.id, data.title, data.ptw_color ?? data.color)
  }

  static example: PTWTypeModel[] = [
    new PTWTypeModel(1, 'Hot Work'),
    new PTWTypeModel(2, 'Cold Work'),
  ]

  static transformData(data: string[][]): PTWTypeModel[] {
    return data.map((row, index) => new PTWTypeModel(index + 1, row[0] || ''))
  }
}
