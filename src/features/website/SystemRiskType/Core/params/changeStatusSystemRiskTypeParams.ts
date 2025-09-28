import type Params from "@/base/core/params/params";

export default class ChangeSystemRiskTypeStatusParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["our_system_risk_type_id"] = this.id;
    return data;
  }
}
