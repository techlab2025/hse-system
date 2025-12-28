import type Params from "@/base/core/params/params";

export default class DeleteWhereHouseParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["warehouse_id"] = this.id;
    return data;
  }
}
