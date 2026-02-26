export default class MostUsedModel {
  public id: number
  public rootCauseTitle: string
  public count: number

  constructor(id: number, rootCauseTitle: string, count: number) {
    this.id = id
    this.rootCauseTitle = rootCauseTitle
    this.count = count
  }

  static fromMap(data: any): MostUsedModel {
    return new MostUsedModel(
      data.root_cause_id,
      data.root_cause_title,
      data.count,
    )
  }

  static example: MostUsedModel = new MostUsedModel(
    1,
    'Most Used',
    10,
  )
}
