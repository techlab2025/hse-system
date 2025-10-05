import type Params from "@/base/core/params/params";


export default class EditAdminParams implements Params {
  public admin_id: number;
  public name: string;
  public email: string;
  public password: string;
  public phone: string;


  // Array of objects for required fields and their messages
  requiredFields = [
    { field: "name", message: "name is required." },
    { field: "email", message: "email is required." },
    { field: "phone", message: "phone is required." },
    // { field: "password", message: "password is required." },
  ];

  constructor(data: {
    admin_id: number;
    name: string;
    email: string;
    password: string;
    phone: string;


  }) {
    this.admin_id = data.admin_id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;

  }

  toMap(): { [key: string]: any } {
    // console.log(this.id);
    return {
      admin_id: this.admin_id,
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,

    };
  }
}
