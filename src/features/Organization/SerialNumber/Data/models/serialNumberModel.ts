export default class SerialNumberModel {
  public id: number
  public name: string
  public prefix: string
  public suffix: string
  public start : string | number

  constructor(id: number, name: string, prefix: string, suffix: string , start : string | number) {
    this.id = id
    this.name = name
    this.prefix = prefix
    this.suffix = suffix
    this.start = start
  }

  static fromMap(data: any): SerialNumberModel {
    return new SerialNumberModel(data.id, data.name, data.prefix, data.suffix , data.start    )
  }
}
