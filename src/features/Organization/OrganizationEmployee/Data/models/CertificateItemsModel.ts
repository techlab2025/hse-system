export default class CertificateItemsModel {
  public id: number
  public title: string
  public isDone: boolean

  constructor(id: number, title: string, isDone: boolean) {
    this.id = id
    this.title = title
    this.isDone = isDone
  }

  static fromMap(data: any): CertificateItemsModel {
    return new CertificateItemsModel(data.id, data.title, data.isDone)
  }

  static example: CertificateItemsModel = new CertificateItemsModel(1, 'Mohab', true)
}
