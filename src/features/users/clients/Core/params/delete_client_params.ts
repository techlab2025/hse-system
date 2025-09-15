import type Params from "@/base/core/params/params";

export default class DeleteClientParams implements Params {

  constructor(public id: string) {
    this.id = id;
  }

  toMap(): Record<string, string> {
    const data: Record<string, string> = {};
    data["client_id"] = this.id;
    return data;
  }
}
