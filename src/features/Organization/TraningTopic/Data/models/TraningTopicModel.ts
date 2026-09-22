import TitleInterface from '@/base/Data/Models/title_interface'

export default class TraningTopicModel extends TitleInterface {
  constructor(id: number, title: string) { super({ id, title }) }

  static fromMap(data: any): TraningTopicModel {
    return new TraningTopicModel(data.id, data.title)
  }

  static example(): TraningTopicModel {
    return new TraningTopicModel(1, 'Training Topic')
  }

  static transformData(data: TraningTopicModel[]): string[][] {
    return data.map((item) => [item.title])
  }
}
