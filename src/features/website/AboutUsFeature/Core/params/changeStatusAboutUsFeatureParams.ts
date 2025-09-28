import type Params from "@/base/core/params/params";

export default class ChangeStatusAboutUsFeatureParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["about_us_feature_id"] = this.id;
    return data;
  }
}
