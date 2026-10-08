import type Params from '@/base/core/params/params'

export default class FetchPPEMatrixDeliveriesParams implements Params {
  constructor(
    public projectId: number | null = null,
    public page: number = 1,
    public limit: number = 10,
  ) {}

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    if (this.projectId != null) data.project_id = this.projectId
    return data
  }
}
