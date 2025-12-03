import TitleModel from '@/base/core/Models/title_model'

export default class MorphModel extends TitleModel {
  public hierarchy: []

  constructor(id: number, name: string, hierarchy: []) {
    super(name, id)
    this.hierarchy = hierarchy
  }

  static fromMap(data: any): MorphModel {
    return new MorphModel(data.id, data.name || data.title, data.hierarchy)
  }
}
