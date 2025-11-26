export default class FilesModel {
  public id: number
  public fileName: string
  public url: string

  constructor(id: number, fileName: string, url: string) {
    this.id = id
    this.fileName = fileName
    this.url = url
  }

  static fromMap(data: any): FilesModel {
    return new FilesModel(data.id, data.file_name, data.url)
  }
}
