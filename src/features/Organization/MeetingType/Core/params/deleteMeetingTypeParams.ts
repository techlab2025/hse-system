import type Params from "@/base/core/params/params";

export default class DeleteMeetingTypeParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["meeting_type_id"] = this.id;
    return data;
  }
}
