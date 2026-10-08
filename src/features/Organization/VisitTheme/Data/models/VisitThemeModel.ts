import TitleInterface from '@/base/Data/Models/title_interface'

export default class VisitThemeModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): VisitThemeModel {
    return new VisitThemeModel(data.id, data.title)
  }

  static example: VisitThemeModel[] = [
    new VisitThemeModel(1, 'Routine visit'),
    new VisitThemeModel(2, 'Safety visit'),
  ]
}
