export default class InvestegationObserverModel {
  public preventive: string
  public corrective: string

  constructor(preventive: string, corrective: string) {
    this.preventive = preventive
    this.corrective = corrective
  }

  static fromMap(data: any): InvestegationObserverModel {
    return new InvestegationObserverModel(data.preventive, data.corrective)
  }
}
