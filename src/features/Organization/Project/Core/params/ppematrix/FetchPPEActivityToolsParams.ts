import type Params from "@/base/core/params/params";

export default class FetchPPEActivityToolsParams implements Params {
  public ppeActivityId?: number
  public ProjectId?: number
  constructor(data: { ppeActivityId?: number; ProjectId?: number }) {
    this.ProjectId = data.ProjectId
    this.ppeActivityId = data.ppeActivityId
  }

  toMap(): Record<string, number> {
    return {
      ppe_activity_id: this.ppeActivityId!,
      project_id: this.ProjectId!,
    }
  }
}
