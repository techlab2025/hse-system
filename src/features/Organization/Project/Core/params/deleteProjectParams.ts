import type Params from "@/base/core/params/params";

export default class DeleteProjectParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["project_id"] = this.id;
    return data;
  }
}
