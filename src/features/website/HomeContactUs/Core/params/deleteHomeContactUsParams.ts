import type Params from "@/base/core/params/params";

export default class DeleteHomeContactUsParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["home_contact_us_id"] = this.id;
    return data;
  }
}
