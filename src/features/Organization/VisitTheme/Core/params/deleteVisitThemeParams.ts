import type Params from "@/base/core/params/params";

export default class DeleteVisitThemeParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["visit_Theme_id"] = this.id;
    return data;
  }
}
