import TitleInterface from '@/base/Data/Models/title_interface'

export default class TitleModel extends TitleInterface {
  constructor(title: string, id: number) {
    super({ id: id, title: title })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(data: any): TitleModel {
    return new TitleModel(data?.title || data?.name, data?.id)
  }
}
