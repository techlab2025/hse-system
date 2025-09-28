import type Params from "@/base/core/params/params";

export default class DeleteSystemFeatureParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["our_system_feature_id"] = this.id;
    return data;
  }
}
