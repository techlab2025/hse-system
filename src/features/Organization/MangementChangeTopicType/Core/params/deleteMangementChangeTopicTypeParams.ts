import type Params from "@/base/core/params/params";

export default class DeleteMangementChangeTopicTypeParams implements Params {

  constructor(public id: number) {
    this.id = id;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {};
    data["changement_topic_id"] = this.id;
    return data;
  }
}
