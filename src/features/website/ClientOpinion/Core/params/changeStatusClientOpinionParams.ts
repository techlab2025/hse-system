import type Params from "@/base/core/params/params";

export default class ChangeStatusClientOpinionParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["client_opinion_id"] = this.id;
    return data;
  }
}
