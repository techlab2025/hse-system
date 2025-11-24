import TitleInterface from '@/base/Data/Models/title_interface'

export default class ItemModel extends TitleInterface {
  // public isDanger: number

  constructor(id: number, title: string, isDanger: number) {
    super({ id: id, title: title, subtitle: isDanger })
    // this.isDanger = isDanger
  }

  static fromMap(data: any): ItemModel {
    return new ItemModel(data.id, data.title, data.is_danger)
  }
}
