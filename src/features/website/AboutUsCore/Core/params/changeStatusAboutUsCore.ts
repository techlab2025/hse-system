import type Params from "@/base/core/params/params";

export default class ChangeStatusAboutUsCoreParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["about_us_core_id"] = this.id;
    return data;
  }
}
