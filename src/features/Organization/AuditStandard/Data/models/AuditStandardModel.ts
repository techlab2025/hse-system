import TitleInterface from '@/base/Data/Models/title_interface'

export default class AuditStandardModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): AuditStandardModel {
    return new AuditStandardModel(data.id, data.title)
  }

  static example: AuditStandardModel[] = [
    new AuditStandardModel(1, 'Audit Standard 1'),
    new AuditStandardModel(2, 'Audit Standard 2'),
  ]

  static transformData(data: string[][]): AuditStandardModel[] {
    return data.map((row, index) => new AuditStandardModel(index + 1, row[0] || ''))
  }
}
