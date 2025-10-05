import type Params from "@/base/core/params/params";

export default class UpdatePasswordEmployeeParams implements Params {
  id?: number;
  password?: string;

  // Array of objects for required fields and their messages
  requiredFields = [{ field: "password", message: "password is required." }];

  constructor(id: number, password: string) {
    this.id = id;
    this.password = password;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["employee_id"] = this.id;
    data["password"] = this.password;
    return data;
  }
}
