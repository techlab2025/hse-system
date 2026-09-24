import type Params from '@/base/core/params/params'

export default class CreatePPEActivityToolParams implements Params {
  constructor(
    public ppeActivityId: number,
    public ppeToolId: number,
  ) {}

  toMap(): Record<string, number> {
    return { ppe_active_id: this.ppeActivityId, ppe_tool_id: this.ppeToolId }
  }
}
