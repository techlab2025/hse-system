export default class MorphModel {
  public id: number
  public name: string
  public hierarchy: []

  constructor(id: number, name: string, hierarchy: []) {
    this.id = id
    this.name = name
    this.hierarchy = hierarchy
  }

  static fromMap(data: any): MorphModel {
    return new MorphModel(data.id, data.name, data.hierarchy)
  }
}
