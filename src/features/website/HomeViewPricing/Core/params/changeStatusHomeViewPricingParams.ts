import type Params from "@/base/core/params/params";

export default class ChangeStatusHomeViewPricingParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["home_view_pricing_id"] = this.id;
    return data;
  }
}
