import type Params from "@/base/core/params/params";

export default class DeletePpeItemParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["ppe_item_id"] = this.id;
    return data;
  }
}
