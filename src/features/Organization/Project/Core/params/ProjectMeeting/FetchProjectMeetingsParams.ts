import type Params from '@/base/core/params/params'

export default class FetchProjectMeetingsParams implements Params {
  constructor(
    public projectId: number,
    public page: number = 1,
    public limit: number = 10,
    public paginate: number = 1,
  ) {}

  toMap(): Record<string, number> {
    return {
      project_id: this.projectId,
      paginate: this.paginate,
      page: this.page,
      limit: this.limit,
    }
  }
}
