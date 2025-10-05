import TitleInterface from "@/base/Data/Models/title_interface";

export default class AdminModel extends TitleInterface {
  public name: string;
  public email: string;
  public phone: string;



  constructor(
    id: number,
    name: string,
    email: string,
    phone: string,

  ) {
    super({ id, title: name });
    this.name = name;
    this.email = email;
    this.phone = phone;

  }

  static fromMap(data: any): AdminModel {
    return new AdminModel(
      data.id,
      data.name,
      data.email,
      data.phone,

    );
  }
}
