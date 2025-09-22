// import type TitleModel from "@/base/core/Models/title_model";

export default class IndustryModel {
  public id: number
  public title: string

  constructor(id: number, title: string) {
    this.id = id
    this.title = title
  }

  static fromMap(data: any): IndustryModel {
    return new IndustryModel(data.id, data.title)
  }
}
