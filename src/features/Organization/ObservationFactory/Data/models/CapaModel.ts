export default class CapaModel {
  public preventive: string
  public corrective: string
  public serial_name:Number

  constructor(preventive: string, corrective: string, serial_name:Number) {
    this.preventive = preventive
    this.corrective = corrective
    this.serial_name = serial_name
  }

  static fromMap(data: any): CapaModel {
    return new CapaModel(data.preventive, data.corrective, data.serial_name)
  }

  static example: CapaModel = new CapaModel('preventive', 'corrective', 1)
}
