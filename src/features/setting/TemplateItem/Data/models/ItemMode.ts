import TitleInterface from '@/base/Data/Models/title_interface'

export default class ItemModel extends TitleInterface {
  // public isDanger: number

  constructor(
    id: number,
    title: string,
    isDanger: number,
    textareaType: string,
    hasObservation: number,
  ) {
    super({
      id: id,
      title: title,
      subtitle: isDanger,
      kpi: String(textareaType),
      decodedData: String(hasObservation),
    })
    // this.isDanger = isDanger
  }

  static fromMap(data: any): ItemModel {
    return new ItemModel(
      data.id,
      data.title,
      data.is_danger,
      data.textarea_type,
      data.has_observation,
    )
  }
}
