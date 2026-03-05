import TitleInterface from '@/base/Data/Models/title_interface'

export default class CapaModel extends TitleInterface {
  public id: number
  public title: string

  constructor(id: number, title: string) {
    super({ id, title })
    this.id = id
    this.title = title
  }

  static fromMap(data: any): CapaModel {
    return new CapaModel(data.id, data.title)
  }

  static transformData(data: string[][]): CapaModel[] {
    return data.map((row, index) => new CapaModel(index + 1, row[0] || ''))
  }
}
