
export default class ShowAdminModel {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public phone: string;


  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,

  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;

  }

  static fromMap(data: any): ShowAdminModel {
    return new ShowAdminModel(
      data.id,
      data.name,
      data.email,
      data.password,
      data.phone,

    );
  }
}
