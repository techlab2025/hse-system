import TitleInterface from '@/base/Data/Models/title_interface'

export default class DocumentCategoryModel extends TitleInterface {
  constructor(id: number, title: string) {
    super({ id, title })
  }

  static fromMap(data: any): DocumentCategoryModel {
    return new DocumentCategoryModel(data.id, data.title)
  }

  static example: DocumentCategoryModel[] = [
    new DocumentCategoryModel(1, 'Document Category 1'),
    new DocumentCategoryModel(2, 'Document Category 2'),
  ]

  static transformData(data: string[][]): DocumentCategoryModel[] {
    return data.map((row, index) => new DocumentCategoryModel(index + 1, row[0] || ''))
  }
}
