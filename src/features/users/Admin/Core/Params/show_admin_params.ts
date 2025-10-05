import type Params from "@/base/core/params/params";

export default class ShowAdminParams implements Params {
  id?: string;

  constructor(id: string) {
    this.id = id;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["admin_id"] = this.id;
    return data;
  }
}
