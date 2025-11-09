import TitleModel from '@/base/core/Models/title_model'

export default class ProjectLocationEmployeeModel extends TitleModel {
  constructor(id: number, title: string) {
    super(title, id)
  }

  static fromMap(data: any): ProjectLocationEmployeeModel {
    return new ProjectLocationEmployeeModel(data.id, data.title)
  }
}
