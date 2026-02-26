export default class SingleStaticsModel {
  public type: number
  public count: number

  constructor(type: number, count: number) {
    this.type = type
    this.count = count
  }

  static fromMap(data: any): SingleStaticsModel {
    return new SingleStaticsModel(data.type, data.count)
  }
  static example: SingleStaticsModel = new SingleStaticsModel(1, 200)
}
