import type Params from "@/base/core/params/params";

export default class DeleteInjuryParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["injury_type_id"] = this.id;
    return data;
  }
}
