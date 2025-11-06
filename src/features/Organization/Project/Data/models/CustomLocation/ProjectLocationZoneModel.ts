import TitleModel from '@/base/core/Models/title_model'

export default class ProjectLocationZoneModel extends TitleModel {
  constructor(id: number, title: string) {
    super(title, id)
  }

  static fromMap(data: any): ProjectLocationZoneModel {
    return new ProjectLocationZoneModel(data.id, data.title)
  }
}
