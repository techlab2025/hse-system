export default class InvestegationResultDetailsModel {
  public preventive: string
  public corrective: string

  constructor(preventive: string, corrective: string) {
    this.preventive = preventive
    this.corrective = corrective
  }

  static fromMap(data: any): InvestegationResultDetailsModel {
    return new InvestegationResultDetailsModel(data.preventive, data.corrective)
  }
}
