import TitleInterface from '@/base/Data/Models/title_interface'

export default class VisitActivityModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): VisitActivityModel {
    return new VisitActivityModel(data.id, data.title)
  }

  static example: VisitActivityModel[] = [
    new VisitActivityModel(1, 'Site inspection'),
    new VisitActivityModel(2, 'Safety walkthrough'),
  ]
}
