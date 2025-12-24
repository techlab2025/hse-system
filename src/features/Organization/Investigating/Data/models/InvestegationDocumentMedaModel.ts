
export default class InvestegationDocumentMedaModel {
  public id: number
  public url: string
  public file_name: string

  constructor(id: number, url: string, file_name: string) {
    this.id = id
    this.url = url
    this.file_name = file_name
  }

  static fromMap(data: any): InvestegationDocumentMedaModel {
    return new InvestegationDocumentMedaModel(data.id, data.url, data.file_name)
  }

  static example: InvestegationDocumentMedaModel = new InvestegationDocumentMedaModel(1, 'Mohab', 'Mohab')
}
