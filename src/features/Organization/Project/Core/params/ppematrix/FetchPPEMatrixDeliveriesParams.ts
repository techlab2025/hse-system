import type Params from '@/base/core/params/params'

export default class FetchPPEMatrixDeliveriesParams implements Params {
  constructor(
    public projectId: number,
    public page: number = 1,
    public limit: number = 10,
  ) {}

  toMap(): Record<string, number> {
    return {
      // project_id: this.projectId,
      // paginate: 0,
      // page: this.page,
      // limit: this.limit,
    }
  }
}
