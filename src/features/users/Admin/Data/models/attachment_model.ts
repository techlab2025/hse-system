export default class AttachmentModel {
  public id: number;
  public file: string;
  public alt: string;
  public date: string;
  public name: string;

  constructor(
    id: number,
    file: string,
    alt: string,
    date: string,
    name: string,
  ) {
    this.id = id;
    this.file = file;
    this.alt = alt;
    this.date = date;
    this.name = name;
  }

  static fromMap(data: any): AttachmentModel {
    return new AttachmentModel(
      data.id,
      data.file,
      data.alt,
      data.date,
      data.file_name,
    );
  }
}
