import type Params from "@/base/core/params/params";

export default class DeleteServiceParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["service_id"] = this.id;
    return data;
  }
}
