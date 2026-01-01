export default class incidantFactorModel {
  public Inexperience: number
  public NeedsMintenance: number
  public Misconduct: number

  constructor(
    Inexperience: number,
    NeedsMintenance: number,
    Misconduct: number,
  ) {
    this.Inexperience = Inexperience
    this.NeedsMintenance = NeedsMintenance
    this.Misconduct = Misconduct
  }

  static fromMap(data: any): incidantFactorModel {
    return new incidantFactorModel(data.Inexperience, data.NeedsMintenance, data.Misconduct)
  }
  static example: incidantFactorModel = new incidantFactorModel(30, 120, 200)
}
