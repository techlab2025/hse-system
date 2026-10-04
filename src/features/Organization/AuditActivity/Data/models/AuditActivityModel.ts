import TitleInterface from '@/base/Data/Models/title_interface'

export default class AuditActivityModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): AuditActivityModel {
    return new AuditActivityModel(data.id, data.title)
  }

  static example: AuditActivityModel[] = [
    new AuditActivityModel(1, 'Audit Activity 1'),
    new AuditActivityModel(2, 'Audit Activity 2'),
  ]

  static transformData(data: string[][]): AuditActivityModel[] {
    return data.map((row, index) => new AuditActivityModel(index + 1, row[0] || ''))
  }
}
