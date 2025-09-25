import type Params from "@/base/core/params/params";

export default class ChangeStatusPowerFullParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["power_full_id"] = this.id;
    return data;
  }
}
