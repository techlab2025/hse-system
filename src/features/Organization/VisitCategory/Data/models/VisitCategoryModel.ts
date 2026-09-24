import TitleInterface from '@/base/Data/Models/title_interface'

export default class VisitCategoryModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): VisitCategoryModel {
    return new VisitCategoryModel(data.id, data.title)
  }

  static example: VisitCategoryModel[] = [
    new VisitCategoryModel(1, 'Routine visit'),
    new VisitCategoryModel(2, 'Safety visit'),
  ]
}
