import type Params from "@/base/core/params/params";

export default class DeleteHealthConditionsParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["health_conditions_id"] = this.id;
    return data;
  }
}
