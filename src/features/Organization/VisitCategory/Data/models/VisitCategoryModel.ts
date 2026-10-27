import { localizedRecord } from '@/localization/records'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class VisitCategoryModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): VisitCategoryModel {
    return localizedRecord(new VisitCategoryModel(data.id, data.title), data)
  }

  static example: VisitCategoryModel[] = [
    new VisitCategoryModel(1, 'Routine visit'),
    new VisitCategoryModel(2, 'Safety visit'),
  ]
}
