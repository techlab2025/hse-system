export default class ItemModel {
  public id: number
  public title: string
  public isDanger: number

  constructor(id: number, title: string, isDanger: number) {
    this.id = id
    this.title = title
    this.isDanger = isDanger
  }

  static fromMap(data: any): ItemModel {
    return new ItemModel(data.id, data.title, data.is_danger)
  }
}
