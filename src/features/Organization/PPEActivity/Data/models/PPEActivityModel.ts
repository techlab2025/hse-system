import TitleInterface from '@/base/Data/Models/title_interface'

export default class PPEActivityModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): PPEActivityModel {
    return new PPEActivityModel(data.id, data.title)
  }

  static example: PPEActivityModel[] = [
    new PPEActivityModel(1, 'PPE Activity 1'),
    new PPEActivityModel(2, 'PPE Activity 2'),
  ]

  static transformData(data: string[][]): PPEActivityModel[] {
    return data.map((row, index) => new PPEActivityModel(index + 1, row[0] || ''))
  }
}
