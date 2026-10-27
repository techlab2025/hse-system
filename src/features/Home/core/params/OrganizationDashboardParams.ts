import type Params from '@/base/core/params/params'
/** Immutable scope: never resolves a different header project while a request is running. */
export default class OrganizationDashboardParams implements Params {
  constructor(
    public readonly projectId: number | null,
    public readonly page = 1,
    public readonly projects = false,
  ) {}
  toMap(): Record<string, number> {
    return {
      ...(this.projectId && Number.isSafeInteger(this.projectId) && this.projectId > 0
        ? { project_id: this.projectId }
        : {}),
      ...(this.projects ? { paginate: 1, page: this.page, limit: 5 } : {}),
    }
  }
}
