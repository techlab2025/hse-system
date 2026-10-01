export default class PermitStaticsModel {
  constructor(
    public id: number,
    public totalOfPermits: string,
    public totalActivePermits: string,  
    public totalDraftPermits: number | null,
    public totalCancelledPermits: string,
  ) {}

  static fromMap(data: any): PermitStaticsModel {
    return new PermitStaticsModel(
      Number(data?.id ?? 0),
      data?.total_of_permits ?? '',
      data?.total_active_permits ?? '',
      data?.total_draft_permits ?? '',
      data?.total_cancelled_permits ?? '',
    )
  }
}
