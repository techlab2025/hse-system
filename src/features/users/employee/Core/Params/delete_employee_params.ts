import type Params from "@/base/core/params/params";

export default class DeleteEmployeeParams implements Params {
  id?: string;

  constructor(id: string) {
    this.id = id;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["employee_id"] = this.id;
    return data;
  }
}
