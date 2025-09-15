import TitleInterface from "@/base/Data/Models/title_interface";

export default class NameModel extends TitleInterface{

  constructor(title: string, id: number) {
    super({id: id, title: title})
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(data: any): NameModel {
    return new NameModel(data?.name, data?.id)
  }
}
