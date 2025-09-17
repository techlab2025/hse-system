import type Params from "@/base/core/params/params";

export default class ShowClientParams implements Params {
  id?: string;

  constructor(id: string) {
    this.id = id;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["client_id"] = this.id;
    return data;
  }
}
