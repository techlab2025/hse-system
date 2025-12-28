export default class CapaModel {
  public preventive: string
  public corrective: string

  constructor(preventive: string, corrective: string) {
    this.preventive = preventive
    this.corrective = corrective
  }

  static fromMap(data: any): CapaModel {
    return new CapaModel(data.preventive, data.corrective)
  }

  static example : CapaModel = new CapaModel(
    'preventive',
    'corrective',
  )
}
