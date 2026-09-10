import type Params from "@/base/core/params/params";

export default class DeleteDrillTypeParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["drill_type_id"] = this.id;
    return data;
  }
}
