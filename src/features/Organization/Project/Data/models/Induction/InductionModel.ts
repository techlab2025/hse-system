import TitleInterface from '@/base/Data/Models/title_interface'

export default class InductionModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): InductionModel {
    return new InductionModel(data.id, data.title)
  }

  static example: InductionModel[] = [
    new InductionModel(1, 'PPE Tool 1'),
    new InductionModel(2, 'PPE Tool 2'),
  ]

  static transformData(data: string[][]): InductionModel[] {
    return data.map((row, index) => new InductionModel(index + 1, row[0] || ''))
  }
}
