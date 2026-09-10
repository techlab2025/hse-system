import TitleInterface from '@/base/Data/Models/title_interface'

export default class DrillTypeModel extends TitleInterface {
  public description: string

  constructor(id: number, title: string, description: string = '') {
    super({ id, title })
    this.description = description
  }

  static fromMap(data: any): DrillTypeModel {
    return new DrillTypeModel(data.id, data.title, data.description)
  }

  static example: DrillTypeModel[] = [
    new DrillTypeModel(1, 'Emergency evacuation', 'Emergency evacuation drill'),
    new DrillTypeModel(2, 'Fire drill', 'Fire response and assembly drill'),
  ]

  static transformData(data: string[][]): DrillTypeModel[] {
    return data.map((row, index) => new DrillTypeModel(index + 1, row[0] || '', row[1] || ''))
  }
}
