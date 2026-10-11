import type Params from '@/base/core/params/params'

export default class CreatePPEActivityToolParams implements Params {
  constructor(
    public ppeActivityId: number,
    public ppeToolId: number,
    public projectId?: number | null,
  ) {}

  toMap(): Record<string, number> {
    const data: Record<string, number> = {
      ppe_active_id: this.ppeActivityId,
      ppe_tool_id: this.ppeToolId,
    }

    if (this.projectId != null) data.project_id = this.projectId
    return data
  }
}
