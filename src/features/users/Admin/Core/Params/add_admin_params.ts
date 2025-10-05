import type Params from "@/base/core/params/params";

export default class AddAdminParams implements Params {
  public name: string;
  public email: string;
  public password: string;
  public phone: string;


  // Array of objects for required fields and their messages
  requiredFields = [
    { field: "name", message: "name is required." },
    { field: "email", message: "email is required." },
    { field: "phone", message: "phone is required." },
    { field: "password", message: "password is required." },
  ];

  constructor(data: {
    name: string;
    email: string;
    password: string;
    phone: string;

  }) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;

  }

  toMap(): { [key: string]: any } {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,


    };
  }
}
