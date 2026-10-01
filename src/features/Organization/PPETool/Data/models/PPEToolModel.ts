import TitleInterface from '@/base/Data/Models/title_interface'

export default class PPEToolModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): PPEToolModel {
    return new PPEToolModel(data.id, data.title)
  }

  static example: PPEToolModel[] = [
    new PPEToolModel(1, 'PPE Tool 1'),
    new PPEToolModel(2, 'PPE Tool 2'),
  ]

  static transformData(data: string[][]): PPEToolModel[] {
    return data.map((row, index) => new PPEToolModel(index + 1, row[0] || ''))
  }
}
